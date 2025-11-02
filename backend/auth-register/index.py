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
    Business: Register new user with email verification
    Args: event with httpMethod, body {email, password}
          context with request_id
    Returns: HTTP response with user_id and verification status
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
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Password must be at least 6 characters'})
        }
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    verification_token = secrets.token_urlsafe(32)
    token_expires = datetime.now() + timedelta(hours=24)
    
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
        "SELECT id FROM t_p35759334_music_label_portal.users WHERE email = %s",
        (email,)
    )
    existing_user = cur.fetchone()
    
    if existing_user:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email already registered'})
        }
    
    cur.execute(
        """
        INSERT INTO t_p35759334_music_label_portal.users 
        (email, password_hash, is_verified, verification_token, verification_token_expires, username, role, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (email, password_hash, False, verification_token, token_expires, email.split('@')[0], 'user', datetime.now())
    )
    
    user = cur.fetchone()
    user_id = user['id']
    
    conn.commit()
    cur.close()
    conn.close()
    
    verification_url = f"https://your-domain.poehali.dev/verify?token={verification_token}"
    
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
            .button {{ display: inline-block; background: linear-gradient(to right, #ff8c00, #ffa500); 
                      color: #000; padding: 15px 40px; text-decoration: none; border-radius: 10px; 
                      font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; color: #888; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">420</div>
            <h1>Добро пожаловать в 420 Music!</h1>
            <p>Спасибо за регистрацию! Для активации аккаунта нажмите на кнопку ниже:</p>
            <p style="text-align: center;">
                <a href="{verification_url}" class="button">Подтвердить email</a>
            </p>
            <p>Или скопируйте ссылку в браузер:</p>
            <p style="word-break: break-all; color: #ff8c00;">{verification_url}</p>
            <p>Ссылка действительна 24 часа.</p>
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
            'user_id': user_id,
            'message': 'Registration successful. Please check your email to verify your account.',
            'email_data': {
                'to': email,
                'subject': 'Подтверждение регистрации в 420 Music',
                'html_content': html_content
            }
        })
    }
