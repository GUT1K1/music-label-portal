import json
import os
import psycopg2
import random
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate Telegram bot link code for user
    Args: event with httpMethod, headers (X-User-Id)
    Returns: HTTP response with 6-digit code
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Проверяем, не привязан ли уже Telegram
    cur.execute(
        """SELECT telegram_chat_id FROM t_p35759334_music_label_portal.users 
        WHERE id = %s""",
        (int(user_id),)
    )
    result = cur.fetchone()
    
    if not result:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    telegram_chat_id = result[0]
    
    if telegram_chat_id:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram already linked', 'code': 'ALREADY_LINKED'}),
            'isBase64Encoded': False
        }
    
    # Генерируем 6-значный код
    code = str(random.randint(100000, 999999))
    expires_at = datetime.now() + timedelta(minutes=5)
    
    # Сохраняем код
    cur.execute(
        """UPDATE t_p35759334_music_label_portal.users 
        SET telegram_link_code = %s, telegram_link_code_expires_at = %s 
        WHERE id = %s""",
        (code, expires_at, int(user_id))
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'code': code,
            'expires_at': expires_at.isoformat(),
            'expires_in_seconds': 300
        }),
        'isBase64Encoded': False
    }
