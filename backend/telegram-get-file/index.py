"""
Business: Get file URL from Telegram by file_id for audio playback
Args: event - dict with httpMethod='GET', queryStringParameters with file_id
      context - object with attributes: request_id, function_name
Returns: HTTP response with file URL for streaming
"""

import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
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
        
        # Get file_id from query parameters
        params = event.get('queryStringParameters', {}) or {}
        file_id = params.get('file_id')
        
        if not file_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'file_id parameter is required'})
            }
        
        # Get file path from Telegram
        get_file_url = f'https://api.telegram.org/bot{bot_token}/getFile'
        response = requests.get(get_file_url, params={'file_id': file_id}, timeout=10)
        
        if not response.ok:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Failed to get file from Telegram',
                    'details': response.json()
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
        
        # Build file download URL
        file_path = result['result']['file_path']
        file_url = f'https://api.telegram.org/file/bot{bot_token}/{file_path}'
        file_size = result['result'].get('file_size', 0)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'url': file_url,
                'file_path': file_path,
                'file_size': file_size,
                'file_id': file_id
            })
        }
        
    except Exception as e:
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
