"""
Business: Assemble S3 chunks into single file and upload to Telegram
Args: event - dict with httpMethod='POST', body with JSON {chunkKeys, fileName, contentType}
      context - object with request_id
Returns: Telegram file_id and URL
"""

import json
import os
import requests
import boto3
from typing import Dict, Any, List
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        chunk_keys: List[str] = body_data.get('chunkKeys', [])
        file_name: str = body_data.get('fileName', 'file.bin')
        content_type: str = body_data.get('contentType', 'application/octet-stream')
        
        if not chunk_keys:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No chunkKeys provided'})
            }
        
        print(f'[Assemble] Assembling {len(chunk_keys)} chunks for {file_name}')
        
        # Download and assemble chunks from S3
        access_key = os.environ.get('YC_S3_ACCESS_KEY_ID')
        secret_key = os.environ.get('YC_S3_SECRET_ACCESS_KEY')
        bucket_name = os.environ.get('YC_S3_BUCKET_NAME')
        
        s3_client = boto3.client(
            's3',
            endpoint_url='https://storage.yandexcloud.net',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='ru-central1'
        )
        
        assembled_data = bytearray()
        
        for i, chunk_key in enumerate(chunk_keys):
            print(f'[Assemble] Downloading chunk {i + 1}/{len(chunk_keys)}: {chunk_key}')
            chunk_obj = s3_client.get_object(Bucket=bucket_name, Key=chunk_key)
            chunk_data = chunk_obj['Body'].read()
            assembled_data.extend(chunk_data)
            
            # Clean up chunk after download
            s3_client.delete_object(Bucket=bucket_name, Key=chunk_key)
        
        total_size = len(assembled_data)
        print(f'[Assemble] Assembled {total_size} bytes ({total_size / 1024 / 1024:.2f}MB)')
        
        # Upload to Telegram
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            raise ValueError('TELEGRAM_BOT_TOKEN not configured')
        
        file_ext = file_name.lower().split('.')[-1]
        
        if file_ext in ['mp3', 'wav', 'flac', 'm4a', 'ogg']:
            telegram_url = f'https://api.telegram.org/bot{bot_token}/sendAudio'
            file_field = 'audio'
            mime_type = f'audio/{file_ext}'
        else:
            telegram_url = f'https://api.telegram.org/bot{bot_token}/sendDocument'
            file_field = 'document'
            mime_type = content_type
        
        print(f'[Assemble] Uploading to Telegram as {file_field}...')
        
        files = {
            file_field: (file_name, BytesIO(bytes(assembled_data)), mime_type)
        }
        
        data = {
            'chat_id': '@music_label_storage',  # Канал для хранения файлов
            'title': file_name.rsplit('.', 1)[0]
        }
        
        response = requests.post(
            telegram_url,
            files=files,
            data=data,
            timeout=600
        )
        
        if not response.ok:
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else {'status': response.status_code}
            print(f'[Assemble] Telegram error: {error_data}')
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Telegram upload failed',
                    'details': error_data
                })
            }
        
        result = response.json()
        
        if not result.get('ok'):
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Telegram API error',
                    'details': result
                })
            }
        
        message_result = result['result']
        
        file_info = None
        if 'audio' in message_result:
            file_info = message_result['audio']
        elif 'document' in message_result:
            file_info = message_result['document']
        
        if not file_info:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No file info in Telegram response'})
            }
        
        file_id = file_info['file_id']
        file_unique_id = file_info['file_unique_id']
        duration = file_info.get('duration', 0)
        
        # Получаем публичную ссылку на файл
        get_file_response = requests.get(
            f'https://api.telegram.org/bot{bot_token}/getFile?file_id={file_id}'
        )
        
        if get_file_response.ok:
            file_path = get_file_response.json()['result']['file_path']
            file_url = f'https://api.telegram.org/file/bot{bot_token}/{file_path}'
        else:
            file_url = f'tg://file?file_id={file_id}'
        
        print(f'[Assemble] ✅ Success! file_id={file_id}, size={total_size}')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'file_id': file_id,
                'file_unique_id': file_unique_id,
                'duration': duration,
                'file_size': total_size,
                'file_name': file_name,
                'url': file_url,
                'storage': 'telegram'
            })
        }
        
    except Exception as e:
        print(f'[Assemble] Error: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': str(e),
                'request_id': context.request_id
            })
        }
