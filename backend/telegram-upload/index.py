"""
Business: Upload large audio files to Telegram bot storage using multipart form data
Args: event - dict with httpMethod='POST', body with multipart/form-data file
      context - object with attributes: request_id, function_name
Returns: HTTP response with file_id and file info (or Telegram file URL)
"""

import json
import os
import requests
from typing import Dict, Any
import base64
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-File-Name, X-Chat-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            raise ValueError('TELEGRAM_BOT_TOKEN not configured')
        
        headers = event.get('headers', {})
        file_name_encoded = headers.get('x-file-name') or headers.get('X-File-Name', 'audio.wav')
        chat_id = headers.get('x-chat-id') or headers.get('X-Chat-Id', '420')
        
        # Декодируем имя файла из base64 (поддержка кириллицы)
        try:
            file_name = base64.b64decode(file_name_encoded).decode('utf-8')
        except Exception:
            file_name = file_name_encoded
        
        # Get file from body (binary or base64)
        body = event.get('body', '')
        is_base64 = event.get('isBase64Encoded', False)
        
        if is_base64:
            file_bytes = base64.b64decode(body)
        else:
            file_bytes = body.encode('latin1') if isinstance(body, str) else body
        
        if not file_bytes:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No file data provided'})
            }
        
        # Determine file type and Telegram method
        file_ext = file_name.lower().split('.')[-1]
        
        if file_ext in ['mp3', 'wav', 'flac', 'm4a', 'ogg']:
            telegram_url = f'https://api.telegram.org/bot{bot_token}/sendAudio'
            file_field = 'audio'
            mime_type = f'audio/{file_ext}'
        else:
            telegram_url = f'https://api.telegram.org/bot{bot_token}/sendDocument'
            file_field = 'document'
            mime_type = 'application/octet-stream'
        
        # Upload to Telegram with timeout for large files
        files = {
            file_field: (file_name, BytesIO(file_bytes), mime_type)
        }
        
        data = {
            'chat_id': chat_id,
            'title': file_name.rsplit('.', 1)[0]
        }
        
        print(f'[TG Upload] Uploading {file_name} ({len(file_bytes)} bytes) to chat {chat_id}')
        
        response = requests.post(
            telegram_url, 
            files=files, 
            data=data, 
            timeout=600  # 10 минут для больших файлов
        )
        
        if not response.ok:
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else {'status': response.status_code}
            print(f'[TG Upload] Error: {error_data}')
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Telegram upload failed',
                    'details': error_data
                })
            }
        
        result = response.json()
        
        if not result.get('ok'):
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Telegram API returned error',
                    'details': result
                })
            }
        
        # Extract file info from response
        message_result = result['result']
        
        # Determine which field contains file info
        file_info = None
        if 'audio' in message_result:
            file_info = message_result['audio']
        elif 'document' in message_result:
            file_info = message_result['document']
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Could not find file info in Telegram response',
                    'details': result
                })
            }
        
        file_id = file_info['file_id']
        file_unique_id = file_info['file_unique_id']
        duration = file_info.get('duration', 0)
        file_size = file_info.get('file_size', len(file_bytes))
        
        # Generate public file URL using bot token (Telegram CDN)
        file_url = f'https://api.telegram.org/file/bot{bot_token}/{file_id}'
        
        print(f'[TG Upload] Success! file_id={file_id}, size={file_size}')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'file_id': file_id,
                'file_unique_id': file_unique_id,
                'duration': duration,
                'file_size': file_size,
                'file_name': file_name,
                'url': file_url,
                'storage': 'telegram'
            })
        }
        
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Upload timeout - file too large or connection slow',
                'request_id': context.request_id
            })
        }
    except Exception as e:
        print(f'[TG Upload] Exception: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e),
                'request_id': context.request_id
            })
        }