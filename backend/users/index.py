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
    
    # DEBUG: показываем DSN (без пароля)
    dsn_parts = dsn.split('@')
    if len(dsn_parts) > 1:
        db_part = dsn_parts[1]  # host:port/database
        print(f"[DEBUG] DSN database part: {db_part}")
    print(f"[DEBUG] Full DSN (censored): {dsn[:30]}...{dsn[-50:]}")
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('id')
        
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        if user_id:
            query = f'''
                SELECT id, username, role, full_name, revenue_share_percent, balance, created_at,
                       telegram_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                       vk_photo, vk_email
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
                   vk_photo, vk_email
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
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('id')
        
        if not user_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User ID required'}),
                'isBase64Encoded': False
            }
        
        cur = conn.cursor()
        
        # Формируем SET часть запроса
        updates = []
        if 'full_name' in body_data or 'fullName' in body_data:
            full_name = body_data.get('full_name') or body_data.get('fullName')
            safe_name = full_name.replace("'", "''")
            updates.append(f"full_name = '{safe_name}'")
        
        if 'avatar' in body_data or 'vk_photo' in body_data:
            avatar = body_data.get('avatar') or body_data.get('vk_photo')
            safe_avatar = avatar.replace("'", "''")
            updates.append(f"vk_photo = '{safe_avatar}'")
        
        if 'balance' in body_data:
            updates.append(f"balance = {float(body_data['balance'])}")
        
        if 'revenue_share_percent' in body_data:
            updates.append(f"revenue_share_percent = {int(body_data['revenue_share_percent'])}")
        
        if 'role' in body_data:
            updates.append(f"role = '{body_data['role']}'")
        
        if updates:
            query = f"UPDATE t_p35759334_music_label_portal.users SET {', '.join(updates)} WHERE id = {int(user_id)}"
            cur.execute(query)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }