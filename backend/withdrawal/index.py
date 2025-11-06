import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any, List
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление запросами на вывод средств артистов
    Args: event - dict с httpMethod, body, queryStringParameters, headers
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id_header = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    user_id = int(user_id_header)
    dsn = os.environ.get('DATABASE_URL')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            return handle_get(conn, user_id)
        elif method == 'POST':
            return handle_post(conn, user_id, event)
        elif method == 'PUT':
            return handle_put(conn, user_id, event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def handle_get(conn, user_id: int) -> Dict[str, Any]:
    '''Получить список запросов на вывод'''
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Проверяем роль пользователя
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    role = user['role']
    
    if role == 'director':
        # Руководитель видит все запросы с информацией об артистах
        cursor.execute("""
            SELECT 
                wr.*,
                u.full_name as artist_name,
                u.username as artist_username,
                p.full_name as processor_name
            FROM withdrawal_requests wr
            LEFT JOIN users u ON wr.user_id = u.id
            LEFT JOIN users p ON wr.processed_by = p.id
            ORDER BY 
                CASE WHEN wr.status = 'pending' THEN 0 ELSE 1 END,
                wr.created_at DESC
        """)
    elif role == 'artist':
        # Артист видит только свои запросы
        cursor.execute("""
            SELECT 
                wr.*,
                p.full_name as processor_name
            FROM withdrawal_requests wr
            LEFT JOIN users p ON wr.processed_by = p.id
            WHERE wr.user_id = %s
            ORDER BY wr.created_at DESC
        """, (user_id,))
    else:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Access denied'}),
            'isBase64Encoded': False
        }
    
    requests = cursor.fetchall()
    
    # Конвертируем Decimal в float для JSON
    for req in requests:
        if 'amount' in req and isinstance(req['amount'], Decimal):
            req['amount'] = float(req['amount'])
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(requests, default=str),
        'isBase64Encoded': False
    }

def handle_post(conn, user_id: int, event: Dict[str, Any]) -> Dict[str, Any]:
    '''Создать запрос на вывод (только для артистов)'''
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Проверяем роль и баланс пользователя
    cursor.execute("SELECT role, balance FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    if user['role'] != 'artist':
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Only artists can create withdrawal requests'}),
            'isBase64Encoded': False
        }
    
    balance = float(user['balance'])
    
    if balance < 1000:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Minimum balance 1000₽ required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    amount = float(body.get('amount', 0))
    payment_method = body.get('payment_method', '')
    payment_details = body.get('payment_details', '')
    comment = body.get('comment', '')
    
    # Валидация
    if amount < 1000:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Minimum amount 1000₽'}),
            'isBase64Encoded': False
        }
    
    if amount > balance:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Amount exceeds balance'}),
            'isBase64Encoded': False
        }
    
    if payment_method not in ['card', 'phone']:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid payment method'}),
            'isBase64Encoded': False
        }
    
    if not payment_details:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment details required'}),
            'isBase64Encoded': False
        }
    
    # Создаем запрос
    cursor.execute("""
        INSERT INTO withdrawal_requests 
        (user_id, amount, payment_method, payment_details, comment)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, created_at
    """, (user_id, amount, payment_method, payment_details, comment))
    
    result = cursor.fetchone()
    conn.commit()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'id': result['id'],
            'created_at': str(result['created_at']),
            'message': 'Withdrawal request created'
        }),
        'isBase64Encoded': False
    }

def handle_put(conn, user_id: int, event: Dict[str, Any]) -> Dict[str, Any]:
    '''Обработать запрос (только для director)'''
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Проверяем роль пользователя
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user or user['role'] != 'director':
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Only director can process requests'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {})
    request_id = params.get('id')
    
    if not request_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Request ID required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')  # 'approve' or 'reject'
    rejection_reason = body.get('rejection_reason', '')
    
    if action not in ['approve', 'reject']:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    # Получаем запрос
    cursor.execute("""
        SELECT wr.*, u.balance 
        FROM withdrawal_requests wr
        JOIN users u ON wr.user_id = u.id
        WHERE wr.id = %s AND wr.status = 'pending'
    """, (request_id,))
    
    withdrawal = cursor.fetchone()
    
    if not withdrawal:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Request not found or already processed'}),
            'isBase64Encoded': False
        }
    
    if action == 'approve':
        # Проверяем баланс
        if float(withdrawal['balance']) < float(withdrawal['amount']):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient balance'}),
                'isBase64Encoded': False
            }
        
        # Списываем баланс и обновляем статус
        cursor.execute("""
            UPDATE users 
            SET balance = balance - %s 
            WHERE id = %s
        """, (withdrawal['amount'], withdrawal['user_id']))
        
        cursor.execute("""
            UPDATE withdrawal_requests 
            SET status = 'approved', processed_at = NOW(), processed_by = %s
            WHERE id = %s
        """, (user_id, request_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Withdrawal approved and processed'}),
            'isBase64Encoded': False
        }
    
    else:  # reject
        cursor.execute("""
            UPDATE withdrawal_requests 
            SET status = 'rejected', processed_at = NOW(), processed_by = %s, rejection_reason = %s
            WHERE id = %s
        """, (user_id, rejection_reason, request_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Withdrawal rejected'}),
            'isBase64Encoded': False
        }
