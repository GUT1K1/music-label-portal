import json
import os
import psycopg2
import psycopg2.extras
from typing import Dict, Any, List, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления пользователями лейбла с унифицированными названиями полей
    Args: event с httpMethod, queryStringParameters
    Returns: JSON с данными пользователей (БД формат: snake_case)
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    dsn: str = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        if method == 'GET':
            return handle_get(event, conn)
        elif method == 'PUT':
            return handle_put(event, conn)
        elif method == 'POST':
            return handle_post(event, conn)
        else:
            return error_response(405, 'Method not allowed')
    finally:
        conn.close()


def handle_get(event: Dict[str, Any], conn) -> Dict[str, Any]:
    params: Dict[str, str] = event.get('queryStringParameters') or {}
    user_id: Optional[str] = params.get('id')
    
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    if user_id:
        query = '''
            SELECT id, username, role, full_name, revenue_share_percent, balance, created_at,
                   telegram_id, telegram_chat_id, is_blocked, is_frozen, frozen_until, blocked_reason,
                   vk_photo, vk_email, vk_first_name, vk_last_name,
                   yandex_music_url, vk_group_url, tiktok_url, social_links_filled,
                   last_ip, device_fingerprint
            FROM t_p35759334_music_label_portal.users
            WHERE id = %s
        '''
        cur.execute(query, (int(user_id),))
        
        user = cur.fetchone()
        cur.close()
        
        if not user:
            return error_response(404, 'User not found')
        
        return success_response(normalize_user(dict(user)))
    
    role: Optional[str] = params.get('role')
    query = '''
        SELECT id, username, role, full_name, revenue_share_percent, balance, created_at,
               telegram_id, telegram_chat_id, is_blocked, is_frozen, frozen_until, blocked_reason,
               vk_photo, email, vk_email, vk_first_name, vk_last_name,
               yandex_music_url, vk_group_url, tiktok_url, social_links_filled,
               last_ip, device_fingerprint, password_hash,
               vk_photo as avatar
        FROM t_p35759334_music_label_portal.users
        WHERE 1=1
    '''
    
    params_list: List = []
    if role:
        query += " AND role = %s"
        params_list.append(role)
    
    cur.execute(query, params_list)
    users = cur.fetchall()
    cur.close()
    
    return success_response([normalize_user(dict(u)) for u in users])


def handle_put(event: Dict[str, Any], conn) -> Dict[str, Any]:
    body_data: Dict[str, Any] = json.loads(event.get('body', '{}'))
    user_id: Optional[int] = body_data.get('id')
    
    if not user_id:
        return error_response(400, 'User ID required')
    
    cur = conn.cursor()
    
    updates: List[str] = []
    params: List[Any] = []
    
    if 'full_name' in body_data:
        updates.append("full_name = %s")
        params.append(body_data['full_name'])
    
    if 'vk_photo' in body_data:
        updates.append("vk_photo = %s")
        params.append(body_data['vk_photo'])
    
    # Поддерживаем обновление через avatar
    if 'avatar' in body_data and 'vk_photo' not in body_data:
        updates.append("vk_photo = %s")
        params.append(body_data['avatar'])
    
    if 'vk_email' in body_data:
        updates.append("vk_email = %s")
        params.append(body_data['vk_email'])
    
    if 'balance' in body_data:
        updates.append("balance = %s")
        params.append(float(body_data['balance']))
    
    if 'revenue_share_percent' in body_data:
        updates.append("revenue_share_percent = %s")
        params.append(int(body_data['revenue_share_percent']))
    
    if 'role' in body_data:
        updates.append("role = %s")
        params.append(body_data['role'])
    
    if 'username' in body_data:
        updates.append("username = %s")
        params.append(body_data['username'])
    
    if 'email' in body_data:
        updates.append("email = %s")
        params.append(body_data['email'])
    
    if 'yandex_music_url' in body_data:
        updates.append("yandex_music_url = %s")
        params.append(body_data['yandex_music_url'])
    
    if 'vk_group_url' in body_data:
        updates.append("vk_group_url = %s")
        params.append(body_data['vk_group_url'])
    
    if 'tiktok_url' in body_data:
        updates.append("tiktok_url = %s")
        params.append(body_data['tiktok_url'])
    
    if 'telegram_chat_id' in body_data:
        updates.append("telegram_chat_id = %s")
        params.append(body_data['telegram_chat_id'])
    
    if 'new_password' in body_data and body_data['new_password']:
        import hashlib
        password_hash = hashlib.sha256(body_data['new_password'].encode()).hexdigest()
        updates.append("password_hash = %s")
        params.append(password_hash)
    
    if updates:
        params.append(int(user_id))
        query = f"UPDATE t_p35759334_music_label_portal.users SET {', '.join(updates)} WHERE id = %s"
        cur.execute(query, params)
        conn.commit()
    
    cur.close()
    
    return success_response({'success': True})


def handle_post(event: Dict[str, Any], conn) -> Dict[str, Any]:
    body_data: Dict[str, Any] = json.loads(event.get('body', '{}'))
    
    username: str = body_data.get('username', '')
    full_name: str = body_data.get('full_name', '')
    role: str = body_data.get('role', 'artist')
    
    if not username or not full_name:
        return error_response(400, 'Username and full_name are required')
    
    cur = conn.cursor()
    
    query = '''
        INSERT INTO t_p35759334_music_label_portal.users 
        (username, full_name, role, balance, created_at)
        VALUES (%s, %s, %s, 0, NOW())
        RETURNING id
    '''
    
    cur.execute(query, (username, full_name, role))
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    
    return success_response({
        'success': True,
        'user_id': user_id,
        'username': username,
        'full_name': full_name,
        'role': role
    })


def normalize_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """Приводит данные пользователя к числовым типам где нужно и синхронизирует avatar с vk_photo"""
    if 'balance' in user and user['balance'] is not None:
        user['balance'] = float(user['balance'])
    if 'revenue_share_percent' in user and user['revenue_share_percent'] is not None:
        user['revenue_share_percent'] = int(user['revenue_share_percent'])
    
    # Синхронизируем avatar и vk_photo
    if 'vk_photo' in user and user['vk_photo']:
        user['avatar'] = user['vk_photo']
    elif 'avatar' in user and user['avatar']:
        user['vk_photo'] = user['avatar']
    
    return user


def success_response(data: Any) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, default=str),
        'isBase64Encoded': False
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }