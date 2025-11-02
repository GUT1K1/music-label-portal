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
from psycopg2.extras import RealDictCursor

def sql_escape(value):
    if value is None or value == '':
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    return f"'{str(value).replace(chr(39), chr(39)+chr(39))}'"

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    return psycopg2.connect(dsn)

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
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    user_id_int = int(user_id)
    
    cursor.execute("SELECT role FROM t_p35759334_music_label_portal.users WHERE id = %s", (user_id_int,))
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    thread_id = params.get('thread_id')
    
    if thread_id:
        thread_id_int = int(thread_id)
        cursor.execute("""
            SELECT * FROM t_p35759334_music_label_portal.support_threads
            WHERE id = %s
        """, (thread_id_int,))
        
        thread = cursor.fetchone()
        
        if not thread:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Thread not found'})
            }
        
        cursor.execute("""
            SELECT * FROM t_p35759334_music_label_portal.messages
            WHERE thread_id = %s
            ORDER BY created_at ASC
        """, (thread_id_int,))
        
        messages = cursor.fetchall()
        
        cursor.execute("""
            UPDATE t_p35759334_music_label_portal.messages
            SET is_read = true
            WHERE thread_id = %s AND sender_id != %s AND is_read = false
        """, (thread_id_int, user_id_int))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'thread': dict(thread),
                'messages': [dict(msg) for msg in messages]
            }, default=str)
        }
    
    else:
        if user_role in ['manager', 'boss']:
            status_filter = params.get('status', 'all')
            
            if status_filter != 'all':
                cursor.execute("""
                    SELECT * FROM t_p35759334_music_label_portal.support_threads
                    WHERE status = %s
                    ORDER BY last_message_at DESC
                """, (status_filter,))
            else:
                cursor.execute("""
                    SELECT * FROM t_p35759334_music_label_portal.support_threads
                    ORDER BY last_message_at DESC
                """)
        else:
            cursor.execute("""
                SELECT * FROM t_p35759334_music_label_portal.support_threads
                WHERE artist_id = %s
                ORDER BY last_message_at DESC
            """, (user_id_int,))
        
        threads = cursor.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'threads': [dict(thread) for thread in threads]
            }, default=str)
        }

def create_thread(conn, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    subject = data.get('subject', 'Новый вопрос').replace("'", "''")
    priority = data.get('priority', 'normal')
    initial_message = data.get('message', '').replace("'", "''")
    user_id_int = int(user_id)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        INSERT INTO t_p35759334_music_label_portal.support_threads 
        (artist_id, subject, status, priority, created_at, updated_at, last_message_at)
        VALUES (%s, %s, 'new', %s, NOW(), NOW(), NOW())
        RETURNING id
    """, (user_id_int, subject, priority))
    
    thread_id = cursor.fetchone()['id']
    
    if initial_message:
        cursor.execute("""
            INSERT INTO t_p35759334_music_label_portal.messages 
            (thread_id, sender_id, message, created_at, is_read, message_type)
            VALUES (%s, %s, %s, NOW(), false, 'text')
        """, (thread_id, user_id_int, initial_message))
    
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
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    message_type = 'text'
    if attachment_url:
        if attachment_url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            message_type = 'image'
        else:
            message_type = 'file'
    
    cursor.execute("""
        INSERT INTO t_p35759334_music_label_portal.messages 
        (thread_id, sender_id, message, created_at, is_read, message_type, 
         attachment_url, attachment_name, attachment_size, is_internal_note)
        VALUES (%s, %s, %s, NOW(), false, %s, %s, %s, %s, %s)
        RETURNING id
    """, (thread_id_int, user_id_int, message, message_type, attachment_url, attachment_name, attachment_size, is_internal))
    
    message_id = cursor.fetchone()['id']
    
    cursor.execute("""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET last_message_at = NOW(), updated_at = NOW()
        WHERE id = %s
    """, (thread_id_int,))
    
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
        cursor.execute("""
            UPDATE t_p35759334_music_label_portal.support_threads
            SET status = %s, updated_at = NOW()
            WHERE id = %s
        """, (status, thread_id_int))
    
    if priority:
        cursor.execute("""
            UPDATE t_p35759334_music_label_portal.support_threads
            SET priority = %s, updated_at = NOW()
            WHERE id = %s
        """, (priority, thread_id_int))
    
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
    
    cursor.execute("""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET assigned_to = %s, status = 'in_progress', updated_at = NOW()
        WHERE id = %s
    """, (int(assigned_to) if assigned_to else None, thread_id_int))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }