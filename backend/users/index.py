import json
import os
import psycopg2
import psycopg2.extras

def handler(event, context):
    '''
    Business: API для управления пользователями лейбла
    Args: event с httpMethod, queryStringParameters
    Returns: JSON с данными пользователей
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    # DEBUG
    dsn_user = dsn.split('//')[1].split(':')[0] if '//' in dsn else 'unknown'
    print(f"[DEBUG] DSN user: {dsn_user}")
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('id')
        
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        if user_id:
            # Указываем схему ЯВНО
            query = f'''
                SELECT id, username, role, full_name, revenue_share_percent, balance, created_at,
                       telegram_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                       vk_photo, vk_email, avatar
                FROM t_p35759334_music_label_portal.users
                WHERE id = {int(user_id)}
            '''
            cur.execute(query)
            
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(user), default=str),
                'isBase64Encoded': False
            }
        
        role = params.get('role')
        query = '''
            SELECT id, username, role, full_name, revenue_share_percent, balance, created_at,
                   telegram_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                   vk_photo, vk_email, avatar
            FROM t_p35759334_music_label_portal.users
            WHERE 1=1
        '''
        
        if role:
            query += f" AND role = '{role}'"
        
        cur.execute(query)
        users = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(u) for u in users], default=str),
            'isBase64Encoded': False
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }