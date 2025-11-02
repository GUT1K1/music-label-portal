import json
import os
import secrets
import hashlib
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Complete auth system - register, login, verify email, verify 2FA, send emails
    Args: event with httpMethod, path, body
          context with request_id
    Returns: HTTP response based on action
    '''
    method: str = event.get('httpMethod', 'POST')
    path: str = event.get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    if action == 'register':
        return register_user(event)
    elif action == 'login':
        return login_user(event)
    elif action == 'verify-2fa':
        return verify_2fa(event)
    elif action == 'verify-email':
        return verify_email(event)
    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action. Use: register, login, verify-2fa, verify-email'})
        }


def send_email(to: str, subject: str, html_content: str) -> bool:
    resend_api_key = os.environ.get('RESEND_API_KEY')
    if not resend_api_key:
        return False
    
    url = 'https://api.resend.com/emails'
    headers = {
        'Authorization': f'Bearer {resend_api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'from': 'onboarding@resend.dev',
        'to': [to],
        'subject': subject,
        'html': html_content
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.status_code == 200


def register_user(event: Dict[str, Any]) -> Dict[str, Any]:
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
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT id FROM t_p35759334_music_label_portal.users WHERE email = %s",
        (email,)
    )
    
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email already registered'})
        }
    
    username = email.split('@')[0]
    full_name = username
    cur.execute(
        """
        INSERT INTO t_p35759334_music_label_portal.users 
        (email, password_hash, is_verified, verification_token, verification_token_expires, username, role, full_name)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (email, password_hash, False, verification_token, token_expires, username, 'artist', full_name)
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
    
    send_email(email, 'Подтверждение регистрации в 420 Music', html_content)
    
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
            'message': 'Registration successful. Please check your email to verify your account.'
        })
    }


def login_user(event: Dict[str, Any]) -> Dict[str, Any]:
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
    
    send_email(email, 'Код двухфакторной авторизации 420 Music', html_content)
    
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
            'user_id': user['id'],
            'message': '2FA code sent to your email'
        })
    }


def verify_2fa(event: Dict[str, Any]) -> Dict[str, Any]:
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


def verify_email(event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters', {})
    token = params.get('token', '').strip()
    
    if not token:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Verification token is required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        """
        SELECT id, email, verification_token_expires, is_verified
        FROM t_p35759334_music_label_portal.users 
        WHERE verification_token = %s
        """,
        (token,)
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid verification token'})
        }
    
    if user['is_verified']:
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Email already verified'})
        }
    
    if datetime.now() > user['verification_token_expires']:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Verification token expired'})
        }
    
    cur.execute(
        """
        UPDATE t_p35759334_music_label_portal.users 
        SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL
        WHERE id = %s
        """,
        (user['id'],)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Email verified successfully! You can now login.',
            'email': user['email']
        })
    }