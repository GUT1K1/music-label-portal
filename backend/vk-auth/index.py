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
        
        # Получаем VK credentials из environment
        vk_app_id = os.environ.get('VK_APP_ID', '54299249')
        
        # КРИТИЧНО: redirect_uri должен ТОЧНО совпадать с тем, что был в authorize!
        # Используем прокси-функцию vk-redirect
        vk_redirect_uri = 'https://functions.poehali.dev/c2662a32-9a12-4f7d-b516-8441bc06cfa5'
        
        # VK ID token exchange - минимальный набор параметров
        token_params = {
            'grant_type': 'authorization_code',
            'code': vk_code,
            'code_verifier': code_verifier,
            'client_id': vk_app_id,
            'redirect_uri': vk_redirect_uri
        }
        
        # device_id опциональный - добавляем только если есть
        if device_id:
            token_params['device_id'] = device_id
        
        # state опциональный - добавляем только если есть
        if body.get('state'):
            token_params['state'] = body.get('state')
        
        # Логируем запрос для отладки
        print(f"Token exchange params: {token_params}")
        
        token_data_encoded = urllib.parse.urlencode(token_params).encode('utf-8')
        # VK ID использует /oauth2/auth для token exchange (не /access_token!)
        token_req = urllib.request.Request(
            'https://id.vk.com/oauth2/auth',
            data=token_data_encoded,
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'MusicLabelPortal/1.0'
            }
        )
        
        try:
            with urllib.request.urlopen(token_req) as token_response:
                token_result = json.loads(token_response.read().decode())
                print(f"VK token response: {token_result}")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"VK API HTTPError: {e.code} - {error_body}")
            # Возвращаем ПОЛНУЮ ошибку от VK для отладки
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'VK API error ({e.code})',
                    'vk_response': error_body,
                    'sent_params': token_params
                }),
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
                'body': json.dumps({
                    'error': token_result.get('error_description', 'Token exchange failed'), 
                    'vk_error': token_result.get('error'),
                    'vk_full_response': token_result,
                    'sent_params': token_params
                }),
                'isBase64Encoded': False
            }
        
        vk_token = token_result.get('access_token')
        vk_user_id_from_token = token_result.get('user_id')
        
        # Получаем информацию о пользователе через VK ID API (нужен client_id!)
        user_info_params = urllib.parse.urlencode({
            'access_token': vk_token,
            'client_id': vk_app_id
        })
        user_info_req = urllib.request.Request(
            'https://id.vk.ru/oauth2/user_info',
            data=user_info_params.encode('utf-8'),
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        with urllib.request.urlopen(user_info_req) as user_response:
            user_info = json.loads(user_response.read().decode())
        
        if 'error' in user_info:
            print(f"VK user_info error: {user_info}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Failed to get user info',
                    'vk_error': user_info.get('error'),
                    'vk_error_description': user_info.get('error_description'),
                    'vk_full_response': user_info
                }),
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
                SET vk_photo = %s
                WHERE vk_id = %s
            """, (vk_photo, str(vk_user_id)))
            conn.commit()
            
            user_response = {
                'id': user_row[0],
                'username': user_row[1],
                'role': user_row[2],
                'full_name': user_row[3],
                'vk_id': user_row[4],
                'vk_photo': avatar_url,
                'is_blocked': user_row[6] or False,
                'is_frozen': user_row[7] or False
            }
        else:
            cur.execute("""
                INSERT INTO t_p35759334_music_label_portal.users 
                (username, full_name, role, vk_id, vk_photo, email, password_hash)
                VALUES (%s, %s, 'artist', %s, %s, %s, 'vk_oauth')
                RETURNING id, username, role, full_name, vk_id, vk_photo, is_blocked, is_frozen
            """, (username, full_name, str(vk_user_id), vk_photo, None))
            
            new_user = cur.fetchone()
            conn.commit()
            
            user_response = {
                'id': new_user[0],
                'username': new_user[1],
                'role': new_user[2],
                'full_name': new_user[3],
                'vk_id': new_user[4],
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