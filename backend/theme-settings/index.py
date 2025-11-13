import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление темой оформления сайта
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id
    Returns: HTTP response с текущей темой или результатом сохранения
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
            cursor.execute('''
                SELECT theme_name, updated_at, updated_by 
                FROM site_settings 
                ORDER BY updated_at DESC 
                LIMIT 1
            ''')
            result = cursor.fetchone()
            
            if result:
                theme_data = {
                    'theme_name': result[0],
                    'updated_at': result[1].isoformat() if result[1] else None,
                    'updated_by': result[2]
                }
            else:
                theme_data = {'theme_name': 'summer', 'updated_at': None, 'updated_by': None}
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(theme_data)
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
            
            cursor.execute('SELECT role FROM users WHERE id = %s', (user_id,))
            user_role = cursor.fetchone()
            
            if not user_role or user_role[0] != 'director':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Only directors can change theme'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            theme_name = body_data.get('theme_name')
            
            if not theme_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'theme_name is required'})
                }
            
            allowed_themes = ['spring', 'summer', 'autumn', 'winter']
            if theme_name not in allowed_themes:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': f'Invalid theme. Allowed: {allowed_themes}'})
                }
            
            cursor.execute('''
                INSERT INTO site_settings (theme_name, updated_at, updated_by)
                VALUES (%s, CURRENT_TIMESTAMP, %s)
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