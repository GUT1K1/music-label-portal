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
import psycopg2.extras

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
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
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
            elif action == 'get_user_releases':
                return get_user_releases(conn, user_id)
            elif action == 'attach_release':
                return attach_release(conn, user_id, body_data)
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
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    user_id_int = int(user_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {sql_escape(user_id_int)}")
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    thread_id = params.get('thread_id')
    
    if thread_id:
        thread_id_int = int(thread_id)
        cursor.execute(f"""
            SELECT *
            FROM t_p35759334_music_label_portal.support_threads
            WHERE id = {sql_escape(thread_id_int)}
        """)
        
        thread = cursor.fetchone()
        
        if thread:
            thread_dict = dict(thread)
            
            if thread_dict.get('release_id'):
                cursor.execute(f"""
                    SELECT title, cover_url
                    FROM t_p35759334_music_label_portal.releases
                    WHERE id = {sql_escape(thread_dict['release_id'])}
                """)
                release = cursor.fetchone()
                if release:
                    thread_dict['release_title'] = release['title']
                    thread_dict['release_cover'] = release.get('cover_url')
            
            if thread_dict.get('track_id'):
                cursor.execute(f"""
                    SELECT title
                    FROM t_p35759334_music_label_portal.tracks
                    WHERE id = {sql_escape(thread_dict['track_id'])}
                """)
                track = cursor.fetchone()
                if track:
                    thread_dict['track_title'] = track['title']
            
            thread = thread_dict
        
        if not thread:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Thread not found'})
            }
        
        cursor.execute(f"""
            SELECT * FROM t_p35759334_music_label_portal.messages
            WHERE thread_id = {sql_escape(thread_id_int)}
            ORDER BY created_at ASC
        """)
        
        messages = cursor.fetchall()
        
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.messages
            SET is_read = true
            WHERE thread_id = {sql_escape(thread_id_int)} AND sender_id != {sql_escape(user_id_int)} AND is_read = false
        """)
        
        if user_role in ['manager', 'director'] and thread.get('status') == 'new':
            cursor.execute(f"""
                UPDATE t_p35759334_music_label_portal.support_threads
                SET status = 'in_progress'
                WHERE id = {sql_escape(thread_id_int)}
            """)
        

        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'thread': thread,
                'messages': [dict(msg) for msg in messages]
            }, default=str)
        }
    
    else:
        where_clause = ""
        if user_role in ['manager', 'director']:
            status_filter = params.get('status', 'all')
            if status_filter != 'all':
                where_clause = f"WHERE status = {sql_escape(status_filter)}"
        else:
            where_clause = f"WHERE artist_id = {sql_escape(user_id_int)}"
        
        query = f"""
            SELECT 
                id, artist_id, subject, status, priority, 
                assigned_to, created_at, updated_at, last_message_at, 
                is_archived, rating
            FROM t_p35759334_music_label_portal.support_threads
            {where_clause}
            ORDER BY last_message_at DESC
        """
        
        cursor.execute(query)
        threads = [dict(t) for t in cursor.fetchall()]
        
        artist_ids = list(set([t['artist_id'] for t in threads if t.get('artist_id')]))
        artists_map = {}
        
        if artist_ids:
            ids_str = ','.join([str(int(aid)) for aid in artist_ids])
            artist_query = f"""
                SELECT id, username, full_name, vk_photo
                FROM t_p35759334_music_label_portal.users
                WHERE id IN ({ids_str})
            """
            cursor2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cursor2.execute(artist_query)
            for artist in cursor2.fetchall():
                artist_dict = dict(artist)
                artist_dict['avatar'] = None
                artists_map[artist['id']] = artist_dict
            cursor2.close()
        
        for thread in threads:
            artist = artists_map.get(thread.get('artist_id'))
            if artist:
                thread['artist_username'] = artist.get('username')
                thread['artist_name'] = artist.get('full_name')  
                thread['artist_avatar'] = artist.get('avatar')
                thread['artist_vk_photo'] = artist.get('vk_photo')
            else:
                thread['artist_username'] = None
                thread['artist_name'] = None  
                thread['artist_avatar'] = None
                thread['artist_vk_photo'] = None
            
            if user_role in ['manager', 'director']:
                thread['with_user_name'] = thread['artist_name'] or thread['artist_username'] or 'Артист'
                thread['with_user_avatar'] = thread['artist_avatar'] or thread['artist_vk_photo']
            else:
                thread['with_user_name'] = 'Техподдержка'
                thread['with_user_avatar'] = None
            
            thread['last_message'] = None
            thread['unread_count'] = 0
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'threads': [dict(t) for t in threads]}, default=str)
        }

def create_thread(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    subject = body_data.get('subject')
    priority = body_data.get('priority', 'normal')
    release_id = body_data.get('release_id')
    track_id = body_data.get('track_id')
    artist_id_param = body_data.get('artist_id')
    
    if not subject:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Subject is required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {sql_escape(user_id_int)}")
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    if user_role in ['manager', 'director']:
        if not artist_id_param:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'artist_id is required for staff'})
            }
        final_artist_id = int(artist_id_param)
    else:
        final_artist_id = user_id_int
    
    cursor.execute(f"""
        INSERT INTO t_p35759334_music_label_portal.support_threads 
        (artist_id, subject, status, priority, release_id, track_id, created_at, updated_at, last_message_at)
        VALUES ({sql_escape(final_artist_id)}, {sql_escape(subject)}, 'new', {sql_escape(priority)}, {sql_escape(release_id)}, {sql_escape(track_id)}, NOW(), NOW(), NOW())
        RETURNING id
    """)
    
    thread_id = cursor.fetchone()['id']
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'thread_id': thread_id}, default=str)
    }

def send_message(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id = body_data.get('thread_id')
    message = body_data.get('message')
    
    if not thread_id or not message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'thread_id and message are required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    thread_id_int = int(thread_id)
    
    cursor.execute(f"""
        SELECT * FROM t_p35759334_music_label_portal.support_threads 
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    thread = cursor.fetchone()
    
    if not thread:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Thread not found'})
        }
    
    cursor.execute(f"""
        INSERT INTO t_p35759334_music_label_portal.messages 
        (thread_id, sender_id, message, created_at, is_read)
        VALUES ({sql_escape(thread_id_int)}, {sql_escape(user_id_int)}, {sql_escape(message)}, NOW(), false)
        RETURNING id
    """)
    
    message_id = cursor.fetchone()['id']
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads 
        SET last_message_at = NOW(), updated_at = NOW()
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message_id': message_id}, default=str)
    }

def update_thread_status(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id = body_data.get('thread_id')
    status = body_data.get('status')
    
    if not thread_id or not status:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'thread_id and status are required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    thread_id_int = int(thread_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {sql_escape(user_id_int)}")
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    if user_role not in ['manager', 'director']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads 
        SET status = {sql_escape(status)}, updated_at = NOW()
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def assign_thread(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id = body_data.get('thread_id')
    assigned_to = body_data.get('assigned_to')
    
    if not thread_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'thread_id is required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    thread_id_int = int(thread_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {sql_escape(user_id_int)}")
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    if user_role not in ['manager', 'director']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    if assigned_to is not None:
        assigned_to_int = int(assigned_to)
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.support_threads 
            SET assigned_to = {sql_escape(assigned_to_int)}, updated_at = NOW()
            WHERE id = {sql_escape(thread_id_int)}
        """)
    else:
        cursor.execute(f"""
            UPDATE t_p35759334_music_label_portal.support_threads 
            SET assigned_to = NULL, updated_at = NOW()
            WHERE id = {sql_escape(thread_id_int)}
        """)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def attach_release(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id = body_data.get('thread_id')
    release_id = body_data.get('release_id')
    track_id = body_data.get('track_id')
    
    if not thread_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'thread_id is required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    thread_id_int = int(thread_id)
    user_id_int = int(user_id)
    
    cursor.execute(f"""
        SELECT artist_id FROM t_p35759334_music_label_portal.support_threads
        WHERE id = {sql_escape(thread_id_int)}
    """)
    thread = cursor.fetchone()
    
    if not thread or thread['artist_id'] != user_id_int:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads
        SET release_id = {sql_escape(release_id)}, track_id = {sql_escape(track_id)}, updated_at = NOW()
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }

def get_user_releases(conn, user_id: str) -> Dict[str, Any]:
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    user_id_int = int(user_id)
    
    cursor.execute(f"""
        SELECT id, title, cover_url, status
        FROM t_p35759334_music_label_portal.releases
        WHERE artist_id = {sql_escape(user_id_int)}
        ORDER BY created_at DESC
    """)
    
    releases = [dict(r) for r in cursor.fetchall()]
    
    release_ids = [r['id'] for r in releases]
    tracks = []
    
    if release_ids:
        ids_str = ','.join([str(rid) for rid in release_ids])
        cursor.execute(f"""
            SELECT id, title, release_id
            FROM t_p35759334_music_label_portal.tracks
            WHERE release_id IN ({ids_str})
            ORDER BY track_number ASC
        """)
        
        tracks_data = cursor.fetchall()
        
        for track in tracks_data:
            release = next((r for r in releases if r['id'] == track['release_id']), None)
            if release:
                track_dict = dict(track)
                track_dict['release_title'] = release['title']
                tracks.append(track_dict)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'releases': releases, 'tracks': tracks}, default=str)
    }

def get_artists(conn, user_id: str) -> Dict[str, Any]:
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    
    cursor.execute(f"SELECT role FROM t_p35759334_music_label_portal.users WHERE id = {sql_escape(user_id_int)}")
    user_role_result = cursor.fetchone()
    user_role = user_role_result['role'] if user_role_result else 'artist'
    
    if user_role not in ['manager', 'director']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    cursor.execute("""
        SELECT id, username, full_name, vk_photo
        FROM t_p35759334_music_label_portal.users
        WHERE role = 'artist'
        ORDER BY full_name ASC
    """)
    
    artists = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'artists': [dict(a) for a in artists]}, default=str)
    }

def rate_thread(conn, user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    thread_id = body_data.get('thread_id')
    rating = body_data.get('rating')
    
    if not thread_id or rating is None:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'thread_id and rating are required'})
        }
    
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    user_id_int = int(user_id)
    thread_id_int = int(thread_id)
    rating_int = int(rating)
    
    cursor.execute(f"""
        SELECT artist_id FROM t_p35759334_music_label_portal.support_threads 
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    thread = cursor.fetchone()
    
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
            'body': json.dumps({'error': 'Forbidden'})
        }
    
    cursor.execute(f"""
        UPDATE t_p35759334_music_label_portal.support_threads 
        SET rating = {sql_escape(rating_int)}, updated_at = NOW()
        WHERE id = {sql_escape(thread_id_int)}
    """)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }