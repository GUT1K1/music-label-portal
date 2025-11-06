import json
import os
from urllib import request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Setup Telegram bot webhook
    Args: event with httpMethod, queryStringParameters
    Returns: HTTP response with webhook setup status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Bot token not configured'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', 'set')
    
    if action == 'info':
        return get_webhook_info(bot_token)
    elif action == 'delete':
        return delete_webhook(bot_token)
    else:
        webhook_url = 'https://functions.poehali.dev/ae7c32d8-5b08-4870-9606-e750de3c31a9'
        return set_webhook(bot_token, webhook_url)

def set_webhook(bot_token: str, webhook_url: str) -> Dict[str, Any]:
    url = f'https://api.telegram.org/bot{bot_token}/setWebhook'
    data = json.dumps({'url': webhook_url}).encode('utf-8')
    
    req = request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'webhook_url': webhook_url,
                    'result': result
                }),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def get_webhook_info(bot_token: str) -> Dict[str, Any]:
    url = f'https://api.telegram.org/bot{bot_token}/getWebhookInfo'
    
    try:
        with request.urlopen(url) as response:
            result = json.loads(response.read().decode('utf-8'))
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def delete_webhook(bot_token: str) -> Dict[str, Any]:
    url = f'https://api.telegram.org/bot{bot_token}/deleteWebhook'
    
    try:
        with request.urlopen(url) as response:
            result = json.loads(response.read().decode('utf-8'))
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
