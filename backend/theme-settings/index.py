import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление персональной темой оформления для каждого пользователя
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id
    Returns: HTTP response с темой пользователя или результатом сохранения
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
            'isBase64Encoded': False,
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            headers = event.get('headers', {})
            user_id_str = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if user_id_str:
                user_id = int(user_id_str)
                cursor.execute(
                    'SELECT theme_preference FROM t_p35759334_music_label_portal.users WHERE id = %s',
                    (user_id,)
                )
                result = cursor.fetchone()
                
                if result and result[0]:
                    theme_name = result[0]
                else:
                    theme_name = 'default'
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'theme_name': theme_name})
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'theme_name': 'default'})
                }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            user_id_str = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id_str:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User ID required'})
                }
            
            user_id = int(user_id_str)
            
            body_data = json.loads(event.get('body', '{}'))
            theme_name = body_data.get('theme_name')
            
            if not theme_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'theme_name is required'})
                }
            
            allowed_themes = ['default', 'spring', 'summer', 'autumn', 'winter', 'sunset', 'ocean', 'forest', 'cosmic', 'lavender', 'cherry', 'mint', 'amber', 'neon', 'midnight', 'peach', 'emerald']
            if theme_name not in allowed_themes:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': f'Invalid theme. Allowed: {allowed_themes}'})
                }
            
            cursor.execute('''
                UPDATE t_p35759334_music_label_portal.users
                SET theme_preference = %s
                WHERE id = %s
            ''', (theme_name, user_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'theme_name': theme_name})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cursor.close()
        conn.close()
