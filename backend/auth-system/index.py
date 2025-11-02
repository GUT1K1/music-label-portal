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
        print('❌ RESEND_API_KEY не найден!')
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
    
    print(f'📧 Отправка письма на {to}...')
    response = requests.post(url, json=payload, headers=headers)
    print(f'📡 Resend ответ: status={response.status_code}, body={response.text}')
    
    if response.status_code != 200:
        print(f'❌ Ошибка отправки: {response.text}')
        return False
    
    print('✅ Письмо отправлено успешно!')
    return True


def register_user(event: Dict[str, Any]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    full_name = body_data.get('full_name', '').strip()
    
    if not email or not password or not full_name:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email, password and full name are required'})
        }
    
    if len(password) < 8:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Password must be at least 8 characters'})
        }
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    verification_token = secrets.token_urlsafe(32)
    token_expires = datetime.now() + timedelta(hours=24)
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT id FROM t_p35759334_music_label_portal.users WHERE email = '" + email.replace("'", "''") + "'"
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
    
    cur.execute(
        """
        INSERT INTO t_p35759334_music_label_portal.users 
        (email, password_hash, email_verified, verification_token, verification_token_expires, username, role, full_name)
        VALUES ('{}', '{}', FALSE, '{}', '{}', '{}', 'artist', '{}')
        RETURNING id
        """.format(
            email.replace("'", "''"),
            password_hash,
            verification_token,
            token_expires.isoformat(),
            username.replace("'", "''"),
            full_name.replace("'", "''")
        )
    )
    
    user = cur.fetchone()
    user_id = user['id']
    conn.commit()
    cur.close()
    conn.close()
    
    verification_url = f"https://420music.ru/verify?token={verification_token}"
    
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
            <p>Спасибо за регистрацию, {full_name}! Для активации аккаунта нажмите на кнопку ниже:</p>
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
        SELECT id, email, password_hash, email_verified, two_factor_enabled 
        FROM t_p35759334_music_label_portal.users 
        WHERE email = '{}'
        """.format(email.replace("'", "''"))
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
    
    if not user.get('email_verified', False):
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Please verify your email first'})
        }
    
    if user.get('two_factor_enabled', False):
        two_fa_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        code_expires = datetime.now() + timedelta(minutes=10)
        
        cur.execute(
            """
            UPDATE t_p35759334_music_label_portal.users 
            SET two_fa_code = '{}', two_fa_code_expires = '{}'
            WHERE id = {}
            """.format(two_fa_code, code_expires.isoformat(), user['id'])
        )
        conn.commit()
        
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
        
        send_email(email, 'Код подтверждения входа - 420 Music', html_content)
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'requires_2fa': True,
                'user_id': user['id'],
                'message': 'Please check your email for the verification code'
            })
        }
    
    cur.execute(
        """
        SELECT id, username, email, role, full_name, telegram_chat_id, 
               yandex_music_url, vk_group_url, tiktok_url, revenue_share_percent
        FROM t_p35759334_music_label_portal.users
        WHERE id = {}
        """.format(user['id'])
    )
    user_data = cur.fetchone()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'user': dict(user_data)
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
            'body': json.dumps({'error': 'User ID and code are required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        """
        SELECT id, email, two_fa_code, two_fa_code_expires
        FROM t_p35759334_music_label_portal.users
        WHERE id = {}
        """.format(user_id)
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid user'})
        }
    
    if user['two_fa_code'] != code:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid verification code'})
        }
    
    code_expires = user['two_fa_code_expires']
    if datetime.fromisoformat(str(code_expires)) < datetime.now():
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Verification code expired'})
        }
    
    cur.execute(
        """
        SELECT id, username, email, role, full_name, telegram_chat_id,
               yandex_music_url, vk_group_url, tiktok_url, revenue_share_percent
        FROM t_p35759334_music_label_portal.users
        WHERE id = {}
        """.format(user_id)
    )
    user_data = cur.fetchone()
    
    cur.execute(
        """
        UPDATE t_p35759334_music_label_portal.users
        SET two_fa_code = NULL, two_fa_code_expires = NULL
        WHERE id = {}
        """.format(user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'user': dict(user_data)
        })
    }


def verify_email(event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
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
        SELECT id, username, email, role, full_name, verification_token, verification_token_expires
        FROM t_p35759334_music_label_portal.users
        WHERE verification_token = '{}'
        """.format(token.replace("'", "''"))
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid verification token'})
        }
    
    token_expires = user.get('verification_token_expires')
    if token_expires and datetime.fromisoformat(str(token_expires)) < datetime.now():
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
        SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL
        WHERE id = {}
        """.format(user['id'])
    )
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'message': 'Email verified successfully! You can now log in.',
            'user': {
                'id': user['id'],
                'email': user['email'],
                'username': user['username']
            }
        })
    }