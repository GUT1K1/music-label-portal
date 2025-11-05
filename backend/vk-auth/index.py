import json
import os
import psycopg2
from typing import Dict, Any
from urllib.parse import urlencode
import urllib.request
import hashlib
import hmac

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: VK OAuth authorization with auto-registration
    Args: event - dict with httpMethod, queryStringParameters, body
          context - object with request_id attribute
    Returns: HTTP response dict with user data or auth URL
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
    
    dsn = os.environ.get('DATABASE_URL')
    vk_app_id = os.environ.get('VK_APP_ID')
    vk_app_secret = os.environ.get('VK_APP_SECRET')
    vk_redirect_uri = os.environ.get('VK_REDIRECT_URI', 'https://poehali.dev/app')
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        code = params.get('code')
        
        if not code:
            auth_params = {
                'client_id': vk_app_id,
                'redirect_uri': vk_redirect_uri,
                'display': 'page',
                'scope': 'email',
                'response_type': 'code',
                'v': '5.131'
            }
            auth_url = f"https://oauth.vk.com/authorize?{urlencode(auth_params)}"
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'auth_url': auth_url}),
                'isBase64Encoded': False
            }
        
        token_params = {
            'client_id': vk_app_id,
            'client_secret': vk_app_secret,
            'redirect_uri': vk_redirect_uri,
            'code': code
        }
        token_url = f"https://oauth.vk.com/access_token?{urlencode(token_params)}"
        
        with urllib.request.urlopen(token_url) as response:
            token_data = json.loads(response.read().decode())
        
        access_token = token_data.get('access_token')
        vk_user_id = token_data.get('user_id')
        vk_email = token_data.get('email')
        
        api_params = {
            'user_ids': str(vk_user_id),
            'fields': 'photo_200',
            'access_token': access_token,
            'v': '5.131'
        }
        api_url = f"https://api.vk.com/method/users.get?{urlencode(api_params)}"
        
        with urllib.request.urlopen(api_url) as response:
            user_data = json.loads(response.read().decode())
        
        vk_user = user_data['response'][0]
        vk_photo = vk_user.get('photo_200')
        full_name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
        username = f"vk_{vk_user_id}"
        
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
            """, (username, full_name, str(vk_user_id), vk_photo, vk_photo, vk_email))
            
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