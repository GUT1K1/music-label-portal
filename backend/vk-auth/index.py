import json
import os
import psycopg2
from typing import Dict, Any
import urllib.request

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: VK ID authorization with auto-registration
    Args: event - dict with httpMethod, body
          context - object with request_id attribute
    Returns: HTTP response dict with user data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        vk_token = body.get('access_token')
        vk_user_id_from_request = body.get('user_id')
        
        if not vk_token:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing VK access token'}),
                'isBase64Encoded': False
            }
        
        # Получаем информацию о пользователе через VK API
        api_url = f"https://api.vk.com/method/users.get?access_token={vk_token}&fields=photo_200&v=5.131"
        
        with urllib.request.urlopen(api_url) as response:
            user_data = json.loads(response.read().decode())
        
        if 'error' in user_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': user_data['error'].get('error_msg', 'VK API error')}),
                'isBase64Encoded': False
            }
        
        vk_user = user_data['response'][0]
        vk_user_id = vk_user.get('id', vk_user_id_from_request)
        vk_photo = vk_user.get('photo_200')
        full_name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
        username = f"vk_{vk_user_id}"
        
        dsn = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, username, role, full_name, vk_id, vk_photo, is_blocked, is_frozen
            FROM t_p35759334_music_label_portal.users 
            WHERE vk_id = %s
        """, (str(vk_user_id),))
        
        user_row = cur.fetchone()
        
        if user_row:
            avatar_url = vk_photo or user_row[5]
            
            cur.execute("""
                UPDATE t_p35759334_music_label_portal.users
                SET vk_photo = %s, avatar = %s
                WHERE vk_id = %s
            """, (vk_photo, vk_photo, str(vk_user_id)))
            conn.commit()
            
            user_response = {
                'id': user_row[0],
                'username': user_row[1],
                'role': user_row[2],
                'full_name': user_row[3],
                'vk_id': user_row[4],
                'avatar': avatar_url,
                'vk_photo': avatar_url,
                'is_blocked': user_row[6] or False,
                'is_frozen': user_row[7] or False
            }
        else:
            cur.execute("""
                INSERT INTO t_p35759334_music_label_portal.users 
                (username, full_name, role, vk_id, vk_photo, avatar, email)
                VALUES (%s, %s, 'artist', %s, %s, %s, %s)
                RETURNING id, username, role, full_name, vk_id, vk_photo, is_blocked, is_frozen
            """, (username, full_name, str(vk_user_id), vk_photo, vk_photo, None))
            
            new_user = cur.fetchone()
            conn.commit()
            
            user_response = {
                'id': new_user[0],
                'username': new_user[1],
                'role': new_user[2],
                'full_name': new_user[3],
                'vk_id': new_user[4],
                'avatar': new_user[5],
                'vk_photo': new_user[5],
                'is_blocked': new_user[6] or False,
                'is_frozen': new_user[7] or False
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'user': user_response}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }