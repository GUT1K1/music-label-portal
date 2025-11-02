import json
import os
import hashlib
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Verify 2FA code and complete login
    Args: event with httpMethod, body {user_id, code}
          context with request_id
    Returns: HTTP response with JWT token and user data
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    user_id = body_data.get('user_id')
    code = body_data.get('code', '').strip()
    
    if not user_id or not code:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id and code are required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        """
        SELECT id, email, two_fa_code, two_fa_code_expires, username, role
        FROM t_p35759334_music_label_portal.users 
        WHERE id = %s
        """,
        (user_id,)
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'})
        }
    
    if not user['two_fa_code'] or not user['two_fa_code_expires']:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No 2FA code requested'})
        }
    
    if datetime.now() > user['two_fa_code_expires']:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': '2FA code expired'})
        }
    
    if user['two_fa_code'] != code:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid 2FA code'})
        }
    
    cur.execute(
        """
        UPDATE t_p35759334_music_label_portal.users 
        SET two_fa_code = NULL, two_fa_code_expires = NULL
        WHERE id = %s
        """,
        (user_id,)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    jwt_secret = os.environ.get('JWT_SECRET', 'default_secret_key')
    session_token = hashlib.sha256(f"{user['id']}-{user['email']}-{datetime.now().isoformat()}".encode()).hexdigest()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'email': user['email'],
                'username': user['username'],
                'role': user['role']
            },
            'session_token': session_token
        })
    }
