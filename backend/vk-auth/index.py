import json
import os
import psycopg2
from typing import Dict, Any
import urllib.request
import urllib.parse

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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400',
                'Content-Type': 'text/plain'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        vk_code = body.get('code')
        code_verifier = body.get('code_verifier')
        device_id = body.get('device_id')
        redirect_uri = body.get('redirect_uri')
        
        if not vk_code or not code_verifier:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing code or code_verifier'}),
                'isBase64Encoded': False
            }
        
        # Получаем настройки из переменных окружения
        vk_app_id = os.environ.get('VK_APP_ID', '54299249')
        
        # Обмениваем код на токен через VK ID API
        vk_redirect_uri = os.environ.get('VK_REDIRECT_URI', 'https://420.рф/app')
        
        token_params = {
            'grant_type': 'authorization_code',
            'code': vk_code,
            'code_verifier': code_verifier,
            'client_id': vk_app_id,
            'redirect_uri': redirect_uri or vk_redirect_uri
        }
        
        # device_id НЕ передаём - VK API его не принимает в token exchange
        
        token_data_encoded = urllib.parse.urlencode(token_params).encode('utf-8')
        token_req = urllib.request.Request(
            'https://id.vk.ru/oauth2/token',
            data=token_data_encoded,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        try:
            with urllib.request.urlopen(token_req) as token_response:
                token_result = json.loads(token_response.read().decode())
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"VK API error: {e.code} - {error_body}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'VK API error: {error_body}'}),
                'isBase64Encoded': False
            }
        
        if 'error' in token_result:
            print(f"VK token error: {token_result}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': token_result.get('error_description', 'Token exchange failed'), 'vk_error': token_result.get('error')}),
                'isBase64Encoded': False
            }
        
        vk_token = token_result.get('access_token')
        vk_user_id_from_token = token_result.get('user_id')
        
        # Получаем информацию о пользователе через VK ID API
        user_info_req = urllib.request.Request(
            'https://id.vk.ru/oauth2/user_info',
            data=f'access_token={vk_token}'.encode('utf-8'),
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        with urllib.request.urlopen(user_info_req) as user_response:
            user_info = json.loads(user_response.read().decode())
        
        if 'error' in user_info:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Failed to get user info'}),
                'isBase64Encoded': False
            }
        
        vk_user = user_info.get('user', {})
        vk_user_id = str(vk_user.get('user_id', vk_user_id_from_token))
        vk_photo = vk_user.get('avatar')
        first_name = vk_user.get('first_name', '')
        last_name = vk_user.get('last_name', '')
        full_name = f"{first_name} {last_name}".strip()
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