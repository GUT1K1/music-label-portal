'''
Business: API для работы с системой техподдержки (чаты, сообщения, статусы)
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: JSON с данными о диалогах поддержки и сообщениях
'''

import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import psycopg2
import psycopg2.extensions

def sql_escape(value):
    if value is None or value == '':
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    return f"'{str(value).replace(chr(39), chr(39)+chr(39))}'"

def row_to_dict(cursor, row):
    if row is None:
        return None
    return dict(zip([desc[0] for desc in cursor.description], row))

def rows_to_dicts(cursor, rows):
    if not rows:
        return []
    cols = [desc[0] for desc in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    conn = psycopg2.connect(dsn)
    conn.set_session(autocommit=True)
    return conn

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            return get_threads(conn, user_id, event.get('queryStringParameters', {}))
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_thread':
                return create_thread(conn, user_id, body_data)
            elif action == 'send_message':
                return send_message(conn, user_id, body_data)
            elif action == 'update_status':
                return update_thread_status(conn, user_id, body_data)
            elif action == 'assign_thread':
                return assign_thread(conn, user_id, body_data)
            elif action == 'get_artists':
                return get_artists(conn, user_id)
            elif action == 'rate_thread':
                return rate_thread(conn, user_id, body_data)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unknown action'})
                }
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    finally:
        conn.close()

def get_threads(conn, user_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
    cursor = conn.cursor()
    
    user_id_int = int(user_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {user_id_int}")
    user_role_result = row_to_dict(cursor, cursor.fetchone())
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    thread_id = params.get('thread_id')
    
    if thread_id:
        thread_id_int = int(thread_id)
        cursor.execute(f"""
            SELECT * FROM t_p35759334_music_label_portal.support_threads
            WHERE id = {thread_id_int}
        """)
        
        thread = row_to_dict(cursor, cursor.fetchone())
        
        if not thread:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Thread not found'})
            }
        
        cursor.execute(f"""
            SELECT * FROM t_p35759334_music_label_portal.messages
            WHERE thread_id = {thread_id_int}
            ORDER BY created_at ASC
        """)
        
        messages = rows_to_dicts(cursor, cursor.fetchall())
        
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.messages
            SET is_read = true
            WHERE thread_id = {thread_id_int} AND sender_id != {user_id_int} AND is_read = false
        """)
        
        if user_role in ['manager', 'director'] and thread.get('status') == 'new':
            cursor.execute(f"""
                UPDATE t_p35759334_music_label_portal.support_threads
                SET status = 'in_progress'
                WHERE id = {thread_id_int}
            """)
        

        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'thread': dict(thread),
                'messages': [dict(msg) for msg in messages]
            }, default=str)
        }
    
    else:
        if user_role in ['manager', 'director']:
            status_filter = params.get('status', 'all')
            
            if status_filter != 'all':
                cursor.execute(f"""
                    SELECT 
                        st.id, st.artist_id, st.subject, st.status, st.priority, 
                        st.assigned_to, st.created_at, st.updated_at, st.last_message_at, 
                        st.is_archived, st.rating,
                        u.username as artist_username,
                        u.full_name as artist_name,
                        u.avatar as artist_avatar,
                        u.vk_photo as artist_vk_photo
                    FROM t_p35759334_music_label_portal.support_threads st
                    LEFT JOIN t_p35759334_music_label_portal.users u ON st.artist_id = u.id
                    WHERE st.status = {sql_escape(status_filter)}
                    ORDER BY st.last_message_at DESC
                """)
                threads = rows_to_dicts(cursor, cursor.fetchall())
                result_threads = []
                for thread in threads:
                    thread_dict = dict(thread)
                    cursor.execute(f"""
                        SELECT message FROM t_p35759334_music_label_portal.messages 
                        WHERE thread_id = {thread['id']} 
                        ORDER BY created_at DESC LIMIT 1
                    """)
                    last_msg = row_to_dict(cursor, cursor.fetchone())
                    thread_dict['last_message'] = last_msg['message'] if last_msg else None
                    cursor.execute(f"""
                        SELECT COUNT(*) as count FROM t_p35759334_music_label_portal.messages 
                        WHERE thread_id = {thread['id']} AND is_read = false AND sender_id != {user_id_int}
                    """)
                    unread = row_to_dict(cursor, cursor.fetchone())
                    thread_dict['unread_count'] = unread['count'] if unread else 0
                    result_threads.append(thread_dict)
                threads = result_threads
            else:
                cursor.execute("""
                    SELECT 
                        st.id, st.artist_id, st.subject, st.status, st.priority, 
                        st.assigned_to, st.created_at, st.updated_at, st.last_message_at, 
                        st.is_archived, st.rating,
                        u.username as artist_username,
                        u.full_name as artist_name,
                        u.avatar as artist_avatar,
                        u.vk_photo as artist_vk_photo
                    FROM t_p35759334_music_label_portal.support_threads st
                    LEFT JOIN t_p35759334_music_label_portal.users u ON st.artist_id = u.id
                    ORDER BY st.last_message_at DESC
                """)
                threads = rows_to_dicts(cursor, cursor.fetchall())
                result_threads = []
                for thread in threads:
                    thread_dict = dict(thread)
                    cursor.execute(f"""
                        SELECT message FROM t_p35759334_music_label_portal.messages 
                        WHERE thread_id = {thread['id']} 
                        ORDER BY created_at DESC LIMIT 1
                    """)
                    last_msg = row_to_dict(cursor, cursor.fetchone())
                    thread_dict['last_message'] = last_msg['message'] if last_msg else None
                    cursor.execute(f"""
                        SELECT COUNT(*) as count FROM t_p35759334_music_label_portal.messages 
                        WHERE thread_id = {thread['id']} AND is_read = false AND sender_id != {user_id_int}
                    """)
                    unread = row_to_dict(cursor, cursor.fetchone())
                    thread_dict['unread_count'] = unread['count'] if unread else 0
                    result_threads.append(thread_dict)
                threads = result_threads
        else:
            cursor.execute(f"""
                SELECT 
                    st.id, st.artist_id, st.subject, st.status, st.priority, 
                    st.assigned_to, st.created_at, st.updated_at, st.last_message_at, 
                    st.is_archived, st.rating
                FROM t_p35759334_music_label_portal.support_threads st
                WHERE artist_id = {user_id_int}
                ORDER BY last_message_at DESC
            """)
            threads = rows_to_dicts(cursor, cursor.fetchall())
            result_threads = []
            for thread in threads:
                thread_dict = dict(thread)
                cursor.execute(f"""
                    SELECT message FROM t_p35759334_music_label_portal.messages 
                    WHERE thread_id = {thread['id']} 
                    ORDER BY created_at DESC LIMIT 1
                """)
                last_msg = row_to_dict(cursor, cursor.fetchone())
                thread_dict['last_message'] = last_msg['message'] if last_msg else None
                cursor.execute(f"""
                    SELECT COUNT(*) as count FROM t_p35759334_music_label_portal.messages 
                    WHERE thread_id = {thread['id']} AND is_read = false AND sender_id != {user_id_int}
                """)
                unread = row_to_dict(cursor, cursor.fetchone())
                thread_dict['unread_count'] = unread['count'] if unread else 0
                result_threads.append(thread_dict)
            threads = result_threads
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'threads': threads
            }, default=str)
        }

def create_thread(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    subject = data.get('subject', 'Новый вопрос').replace("'", "''")
    priority = data.get('priority', 'normal')
    initial_message = data.get('message', '').replace("'", "''")
    user_id_int = int(user_id)
    
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {user_id_int}")
    user_role_result = row_to_dict(cursor, cursor.fetchone())
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    artist_id = user_id_int
    if user_role in ['manager', 'director']:
        artist_id = data.get('artist_id', user_id_int)
    
    cursor.execute(f"""
        INSERT INTO t_p35759334_music_label_portal.support_threads 
        (artist_id, subject, status, priority, created_at, updated_at, last_message_at)
        VALUES ({artist_id}, '{subject}', 'new', {sql_escape(priority)}, NOW(), NOW(), NOW())
        RETURNING id
    """)
    
    result = row_to_dict(cursor, cursor.fetchone())
    thread_id = result['id']
    
    if initial_message:
        cursor.execute(f"""
            INSERT INTO t_p35759334_music_label_portal.messages 
            (thread_id, sender_id, message, created_at, is_read, message_type)
            VALUES ({thread_id}, {user_id_int}, '{initial_message}', NOW(), false, 'text')
        """)
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'thread_id': thread_id, 'success': True})
    }

def send_message(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id_int = int(data.get('thread_id'))
    message = data.get('message', '')
    attachment_url = data.get('attachment_url')
    attachment_name = data.get('attachment_name')
    attachment_size = data.get('attachment_size')
    is_internal = data.get('is_internal_note', False)
    user_id_int = int(user_id)
    
    cursor = conn.cursor()
    
    message_type = 'text'
    if attachment_url:
        if attachment_url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            message_type = 'image'
        else:
            message_type = 'file'
    
    cursor.execute(f"""
        INSERT INTO t_p35759334_music_label_portal.messages 
        (thread_id, sender_id, message, created_at, is_read, message_type, 
         attachment_url, attachment_name, attachment_size, is_internal_note)
        VALUES ({thread_id_int}, {user_id_int}, {sql_escape(message)}, NOW(), false, {sql_escape(message_type)}, {sql_escape(attachment_url)}, {sql_escape(attachment_name)}, {sql_escape(attachment_size)}, {sql_escape(is_internal)})
        RETURNING id
    """)
    
    result = row_to_dict(cursor, cursor.fetchone())
    message_id = result['id']
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET last_message_at = NOW(), updated_at = NOW()
        WHERE id = {thread_id_int}
    """)
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message_id': message_id, 'success': True})
    }

def update_thread_status(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id_int = int(data.get('thread_id'))
    status = data.get('status')
    priority = data.get('priority')
    
    cursor = conn.cursor()
    
    if status:
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.support_threads
            SET status = {sql_escape(status)}, updated_at = NOW()
            WHERE id = {thread_id_int}
        """)
    
    if priority:
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.support_threads
            SET priority = {sql_escape(priority)}, updated_at = NOW()
            WHERE id = {thread_id_int}
        """)
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def assign_thread(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id_int = int(data.get('thread_id'))
    assigned_to = data.get('assigned_to')
    
    cursor = conn.cursor()
    
    assigned_to_value = int(assigned_to) if assigned_to else None
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET assigned_to = {sql_escape(assigned_to_value)}, status = 'in_progress', updated_at = NOW()
        WHERE id = {thread_id_int}
    """)
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def get_artists(conn, user_id: str) -> Dict[str, Any]:
    cursor = conn.cursor()
    
    user_id_int = int(user_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {user_id_int}")
    user_role_result = row_to_dict(cursor, cursor.fetchone())
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    if user_role not in ['manager', 'director']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    cursor.execute("""
        SELECT id, username, full_name, avatar, vk_photo
        FROM t_p35759334_music_label_portal.users
        WHERE role = 'artist'
        ORDER BY full_name ASC
    """)
    
    artists = rows_to_dicts(cursor, cursor.fetchall())
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'artists': [dict(artist) for artist in artists]
        }, default=str)
    }

def rate_thread(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id_int = int(data.get('thread_id'))
    rating = int(data.get('rating'))
    user_id_int = int(user_id)
    
    if rating < 1 or rating > 5:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Rating must be between 1 and 5'})
        }
    
    cursor = conn.cursor()
    
    cursor.execute(f"""
        SELECT artist_id, status FROM t_p35759334_music_label_portal.support_threads
        WHERE id = {thread_id_int}
    """)
    
    thread = row_to_dict(cursor, cursor.fetchone())
    
    if not thread:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Thread not found'})
        }
    
    if thread['artist_id'] != user_id_int:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'You can only rate your own threads'})
        }
    
    if thread['status'] != 'resolved':
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Can only rate resolved threads'})
        }
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET rating = {rating}, updated_at = NOW()
        WHERE id = {thread_id_int}
    """)
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'rating': rating})
    }