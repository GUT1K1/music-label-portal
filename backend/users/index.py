import json
import os
import requests
from datetime import datetime
from typing import Dict, Any, Optional

def get_vk_stats(group_url: str, access_token: str) -> Optional[Dict[str, int]]:
    group_id = group_url.split('/')[-1]
    
    try:
        response = requests.get(
            'https://api.vk.com/method/groups.getById',
            params={
                'group_id': group_id,
                'fields': 'members_count',
                'access_token': access_token,
                'v': '5.131'
            },
            timeout=10
        )
        data = response.json()
        
        if 'response' in data and len(data['response']) > 0:
            return {'followers': data['response'][0].get('members_count', 0)}
    except Exception:
        pass
    
    return None

def get_yandex_music_stats(artist_url: str, token: str) -> Optional[Dict[str, int]]:
    artist_id = artist_url.split('/')[-1]
    
    try:
        response = requests.get(
            f'https://api.music.yandex.net/artists/{artist_id}',
            headers={'Authorization': f'OAuth {token}'},
            timeout=10
        )
        data = response.json()
        
        if 'result' in data:
            return {'listeners': data['result'].get('counts', {}).get('tracks', 0)}
    except Exception:
        pass
    
    return None

def collect_stats(conn, vk_token: str, ya_token: str) -> int:
    import psycopg2.extras
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute('''
        SELECT id, username, vk_group, yandex_music, tiktok
        FROM users
        WHERE role = 'artist' AND vk_group IS NOT NULL AND yandex_music IS NOT NULL
    ''')
    
    artists = cur.fetchall()
    updated_count = 0
    
    for artist in artists:
        artist_id = artist['id']
        vk_url = artist['vk_group']
        ya_url = artist['yandex_music']
        
        vk_stats = get_vk_stats(vk_url, vk_token) if vk_url else None
        ya_stats = get_yandex_music_stats(ya_url, ya_token) if ya_url else None
        
        if vk_stats or ya_stats:
            vk_followers = vk_stats['followers'] if vk_stats else 0
            ya_listeners = ya_stats['listeners'] if ya_stats else 0
            
            cur.execute('''
                SELECT vk_followers, yandex_listeners
                FROM artist_stats
                WHERE user_id = %s
                ORDER BY date DESC
                LIMIT 1
            ''', (artist_id,))
            
            prev_stats = cur.fetchone()
            prev_vk = prev_stats['vk_followers'] if prev_stats else 0
            prev_ya = prev_stats['yandex_listeners'] if prev_stats else 0
            
            vk_change = vk_followers - prev_vk
            ya_change = ya_listeners - prev_ya
            
            cur.execute('''
                INSERT INTO artist_stats (user_id, date, vk_followers, vk_change, yandex_listeners, yandex_change, tiktok_followers, tiktok_change)
                VALUES (%s, %s, %s, %s, %s, %s, 0, 0)
            ''', (artist_id, datetime.now().date(), vk_followers, vk_change, ya_listeners, ya_change))
            
            updated_count += 1
    
    conn.commit()
    cur.close()
    return updated_count

def verify_user(user_id: int, conn) -> Optional[Dict[str, Any]]:
    '''Проверяет пользователя и возвращает его данные'''
    import psycopg2.extras
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        cur.execute(
            "SELECT id, username, role, is_blocked FROM users WHERE id = %s",
            (user_id,)
        )
        user = cur.fetchone()
        cur.close()
        
        if not user or user['is_blocked']:
            return None
        return dict(user)
    except Exception as e:
        print(f"[DEBUG] verify_user error: {type(e).__name__}: {str(e)}")
        cur.close()
        raise

def check_permission(user_role: str, required_role: str) -> bool:
    '''Проверяет права доступа'''
    role_hierarchy = {'director': 3, 'manager': 2, 'artist': 1}
    return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role, 0)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление пользователями лейбла и автосбор статистики
    Args: event - dict с httpMethod, body, queryStringParameters, path
          context - объект с request_id, function_name
    Returns: HTTP response со списком пользователей, результатом создания или сбора статистики
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    import psycopg2
    import psycopg2.extras
    
    headers = event.get('headers', {})
    user_id_header = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized - X-User-Id required'})
        }
    
    try:
        current_user_id = int(user_id_header)
    except ValueError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid user ID'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn, options='-c search_path=t_p35759334_music_label_portal,public')
    
    current_user = verify_user(current_user_id, conn)
    if not current_user:
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found or blocked'})
        }
    
    if action == 'collect_stats' and method == 'POST':
        vk_token = os.environ.get('VK_SERVICE_TOKEN')
        ya_token = os.environ.get('YANDEX_MUSIC_TOKEN')
        
        if not vk_token or not ya_token:
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing API tokens'})
            }
        
        updated_count = collect_stats(conn, vk_token, ya_token)
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'updated': updated_count,
                'message': f'Обновлена статистика для {updated_count} артистов'
            })
        }
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    if method == 'GET':
        user_id_param = query_params.get('id')
        
        if user_id_param:
            try:
                requested_user_id = int(user_id_param)
                if requested_user_id == current_user_id:
                    query = '''SELECT id, username, role, full_name, revenue_share_percent, balance, created_at, 
                                      telegram_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                                      vk_photo, vk_email, avatar 
                               FROM users WHERE id = %s'''
                    cur.execute(query, (requested_user_id,))
                    user = cur.fetchone()
                    
                    cur.close()
                    conn.close()
                    
                    if user:
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'isBase64Encoded': False,
                            'body': json.dumps({'users': [dict(user)]}, default=str)
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'User not found'})
                        }
            except ValueError:
                pass
        
        if not check_permission(current_user['role'], 'manager'):
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Forbidden - insufficient permissions'})
            }
        
        role_filter = query_params.get('role')
        
        query = '''SELECT id, username, role, full_name, revenue_share_percent, balance, created_at, 
                          telegram_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                          vk_photo, vk_email, avatar 
                   FROM users WHERE 1=1'''
        params = []
        
        if role_filter and role_filter != 'all':
            query += ' AND role = %s'
            params.append(role_filter)
        
        query += ' ORDER BY created_at DESC'
        
        cur.execute(query, params)
        users = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'users': [dict(u) for u in users]}, default=str)
        }
    
    if method == 'POST':
        if not check_permission(current_user['role'], 'director'):
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Forbidden - only directors can create users'})
            }
        
        body_data = json.loads(event.get('body', '{}'))
        
        username = body_data.get('username')
        full_name = body_data.get('full_name')
        role = body_data.get('role')
        revenue_share_percent = body_data.get('revenue_share_percent', 50)
        
        if not all([username, full_name, role]):
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        if role not in ['artist', 'manager', 'director']:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid role'})
            }
        
        import bcrypt
        password_hash = bcrypt.hashpw('12345'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        try:
            cur.execute(
                '''INSERT INTO users (username, password_hash, role, full_name, revenue_share_percent)
                   VALUES (%s, %s, %s, %s, %s) RETURNING id''',
                (username, password_hash, role, full_name, revenue_share_percent)
            )
            user_id = cur.fetchone()['id']
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'user_id': user_id,
                    'username': username,
                    'full_name': full_name,
                    'role': role,
                    'message': 'User created'
                })
            }
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Username already exists'})
            }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('id')
        
        if not user_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'User ID is required'})
            }
        
        if current_user_id != user_id and not check_permission(current_user['role'], 'director'):
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Forbidden - can only edit your own profile or must be director'})
            }
        
        if 'role' in body_data:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Forbidden - role cannot be changed via API'})
            }
        
        update_fields = []
        
        if 'fullName' in body_data or 'full_name' in body_data:
            full_name = body_data.get('fullName') or body_data.get('full_name')
            if full_name:
                safe_name = full_name.replace("'", "''")
                update_fields.append(f"full_name = '{safe_name}'")
        
        if 'username' in body_data:
            safe_username = body_data['username'].replace("'", "''")
            update_fields.append(f"username = '{safe_username}'")
        
        if 'email' in body_data:
            email_val = body_data['email']
            if email_val:
                safe_email = email_val.replace("'", "''")
                update_fields.append(f"vk_email = '{safe_email}'")
            else:
                update_fields.append("vk_email = NULL")
        
        if 'avatar' in body_data:
            avatar_val = body_data['avatar']
            if avatar_val:
                safe_avatar = avatar_val.replace("'", "''")
                update_fields.append(f"vk_photo = '{safe_avatar}'")
                update_fields.append(f"avatar = '{safe_avatar}'")
            else:
                update_fields.append("vk_photo = NULL")
                update_fields.append("avatar = NULL")
        
        if 'revenue_share_percent' in body_data:
            update_fields.append(f"revenue_share_percent = {body_data['revenue_share_percent']}")
        
        if 'is_blocked' in body_data:
            update_fields.append(f"is_blocked = {str(body_data['is_blocked']).lower()}")
        
        if 'is_frozen' in body_data:
            update_fields.append(f"is_frozen = {str(body_data['is_frozen']).lower()}")
        
        if 'frozen_until' in body_data:
            frozen = body_data['frozen_until']
            if frozen:
                update_fields.append(f"frozen_until = '{frozen}'")
            else:
                update_fields.append("frozen_until = NULL")
        
        if 'blocked_reason' in body_data:
            reason = body_data['blocked_reason'].replace("'", "''") if body_data['blocked_reason'] else ''
            update_fields.append(f"blocked_reason = '{reason}'")
        
        if 'balance' in body_data and check_permission(current_user['role'], 'director'):
            balance_val = float(body_data['balance'])
            update_fields.append(f"balance = {balance_val}")
        
        if 'password' in body_data:
            from passlib.hash import bcrypt
            password = body_data['password']
            password_hash = bcrypt.hash(password, rounds=12)
            safe_hash = password_hash.replace("'", "''")
            update_fields.append(f"password_hash = '{safe_hash}'")
        
        if not update_fields:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        query = f"UPDATE t_p35759334_music_label_portal.users SET {', '.join(update_fields)} WHERE id = {user_id}"
        
        try:
            cur.execute(query)
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'User updated'})
            }
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Username already exists'})
            }
        except Exception as e:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }