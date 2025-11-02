import json
import os
import secrets
import hashlib
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import bcrypt

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
    gmail_password = os.environ.get('GMAIL_APP_PASSWORD')
    if not gmail_password:
        print('❌ GMAIL_APP_PASSWORD не найден!')
        return False
    
    gmail_user = 'luchshevovsom@gmail.com'
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'420 Music <{gmail_user}>'
    msg['To'] = to
    
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    print(f'📧 Отправка письма на {to} через Gmail...')
    
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to, msg.as_string())
        server.quit()
        
        print('✅ Письмо отправлено успешно!')
        return True
    except Exception as e:
        print(f'❌ Ошибка отправки: {str(e)}')
        return False


def register_user(event: Dict[str, Any]) -> Dict[str, Any]:
    print('🚀 Начало регистрации пользователя')
    body_data = json.loads(event.get('body', '{}'))
    
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    full_name = body_data.get('full_name', '').strip()
    print(f'📝 Email: {email}, Name: {full_name}')
    
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
    
    verification_url = f"https://420.рф/verify?token={verification_token}"
    
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
    
    email_sent = send_email(email, 'Подтверждение регистрации в 420 Music', html_content)
    
    if email_sent:
        print(f'✅ Регистрация успешна для {email}')
    else:
        print(f'⚠️ Письмо НЕ отправлено для {email}, но юзер создан')
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'message': 'Registration successful. Check your email for verification link.',
            'user_id': user_id,
            'email_sent': email_sent
        })
    }
    
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
    print('🔐 Начало логина пользователя')
    body_data = json.loads(event.get('body', '{}'))
    
    login_input = body_data.get('email', '') or body_data.get('username', '')
    login_input = login_input.strip().lower()
    password = body_data.get('password', '')
    
    if not login_input or not password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Login (email or username) and password are required'})
        }
    
    print(f'📝 Login: {login_input}')
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        """
        SELECT id, username, email, full_name, role, password_hash, email_verified, two_factor_enabled, is_blocked 
        FROM t_p35759334_music_label_portal.users 
        WHERE email = '{}' OR username = '{}'
        """.format(login_input.replace("'", "''"), login_input.replace("'", "''"))
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        print('❌ Неверный логин или пароль')
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid login or password'})
        }
    
    stored_hash = user['password_hash']
    password_valid = False
    
    if stored_hash.startswith('$2b$'):
        password_valid = bcrypt.checkpw(password.encode(), stored_hash.encode())
    else:
        sha256_hash = hashlib.sha256(password.encode()).hexdigest()
        password_valid = (stored_hash == sha256_hash)
    
    if not password_valid:
        cur.close()
        conn.close()
        print('❌ Неверный логин или пароль')
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid login or password'})
        }
    
    if user.get('is_blocked', False):
        cur.close()
        conn.close()
        print(f'❌ Пользователь {login_input} заблокирован')
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Your account has been blocked'})
        }
    
    if not user.get('email_verified', False) and user.get('email'):
        cur.close()
        conn.close()
        print(f'⚠️ Email не подтвержден для {login_input}')
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
    
    print(f'✅ Успешный логин пользователя: {user_data["username"]} (role: {user_data["role"]})')
    
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