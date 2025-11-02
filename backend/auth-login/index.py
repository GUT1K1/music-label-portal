import json
import os
import secrets
import hashlib
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Login user with 2FA (send code to email)
    Args: event with httpMethod, body {email, password}
          context with request_id
    Returns: HTTP response with 2FA status and temp_token
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
    
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email and password are required'})
        }
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
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
        SELECT id, email, password_hash, is_verified, two_fa_enabled 
        FROM t_p35759334_music_label_portal.users 
        WHERE email = %s
        """,
        (email,)
    )
    user = cur.fetchone()
    
    if not user or user['password_hash'] != password_hash:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid email or password'})
        }
    
    if not user['is_verified']:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Please verify your email first'})
        }
    
    two_fa_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    code_expires = datetime.now() + timedelta(minutes=10)
    temp_token = secrets.token_urlsafe(32)
    
    cur.execute(
        """
        UPDATE t_p35759334_music_label_portal.users 
        SET two_fa_code = %s, two_fa_code_expires = %s
        WHERE id = %s
        """,
        (two_fa_code, code_expires, user['id'])
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%); 
                         border: 2px solid #ff8c00; border-radius: 20px; padding: 40px; }}
            .logo {{ text-align: center; font-size: 48px; font-weight: bold; 
                     background: linear-gradient(to bottom, #ffd700, #ff8c00); 
                     -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }}
            h1 {{ color: #ff8c00; text-align: center; }}
            p {{ line-height: 1.6; font-size: 16px; }}
            .code {{ display: inline-block; background: linear-gradient(to right, #ff8c00, #ffa500); 
                    color: #000; padding: 20px 40px; font-size: 32px; font-weight: bold; 
                    border-radius: 10px; letter-spacing: 5px; margin: 20px 0; }}
            .footer {{ text-align: center; color: #888; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">420</div>
            <h1>Код двухфакторной авторизации</h1>
            <p>Используйте этот код для входа в ваш аккаунт:</p>
            <p style="text-align: center;">
                <span class="code">{two_fa_code}</span>
            </p>
            <p>Код действителен 10 минут.</p>
            <p style="color: #ff6b6b;">Если вы не пытались войти в аккаунт, немедленно смените пароль!</p>
            <div class="footer">
                <p>2025 © 420 Music Label</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'requires_2fa': True,
            'temp_token': temp_token,
            'user_id': user['id'],
            'message': '2FA code sent to your email',
            'email_data': {
                'to': email,
                'subject': 'Код двухфакторной авторизации 420 Music',
                'html_content': html_content
            }
        })
    }
