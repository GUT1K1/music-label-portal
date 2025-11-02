import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление новостями портала (CRUD операции)
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с новостями
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # CORS OPTIONS
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            # Получение списка новостей
            params = event.get('queryStringParameters') or {}
            type_filter = params.get('type')
            active_only = params.get('active', 'true').lower() == 'true'
            action = params.get('action')
            
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Если запрос на получение опроса
                if action == 'get_poll':
                    news_id = params.get('news_id')
                    if not news_id:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'news_id is required'})
                        }
                    
                    # Получаем опрос
                    cur.execute('''
                        SELECT id, news_id, question
                        FROM t_p35759334_music_label_portal.news_polls
                        WHERE news_id = %s
                    ''', (news_id,))
                    poll = cur.fetchone()
                    
                    if not poll:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Poll not found'})
                        }
                    
                    # Получаем варианты ответов
                    cur.execute('''
                        SELECT id, option_text, votes_count
                        FROM t_p35759334_music_label_portal.poll_options
                        WHERE poll_id = %s
                        ORDER BY id
                    ''', (poll['id'],))
                    options = cur.fetchall()
                    
                    # Проверяем, голосовал ли пользователь
                    user_voted = None
                    if user_id:
                        cur.execute('''
                            SELECT option_id
                            FROM t_p35759334_music_label_portal.poll_votes
                            WHERE poll_id = %s AND user_id = %s
                        ''', (poll['id'], user_id))
                        vote = cur.fetchone()
                        if vote:
                            user_voted = vote['option_id']
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'poll': dict(poll),
                            'options': [dict(opt) for opt in options],
                            'user_voted': user_voted
                        }, default=str)
                    }
                
                # Обычное получение списка новостей
                query = 'SELECT id, title, content, type, is_active, priority, image_url, created_at, updated_at, created_by FROM t_p35759334_music_label_portal.news WHERE 1=1'
                
                if active_only:
                    query += ' AND is_active = true'
                if type_filter:
                    query += f" AND type = '{type_filter}'"
                
                query += ' ORDER BY priority DESC, created_at DESC'
                
                cur.execute(query)
                news = cur.fetchall()
                
                # Для каждой новости проверяем, есть ли опрос
                news_list = []
                for n in news:
                    news_dict = dict(n)
                    cur.execute('''
                        SELECT id, question
                        FROM t_p35759334_music_label_portal.news_polls
                        WHERE news_id = %s
                    ''', (n['id'],))
                    poll = cur.fetchone()
                    news_dict['has_poll'] = poll is not None
                    if poll:
                        news_dict['poll_id'] = poll['id']
                    news_list.append(news_dict)
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(news_list, default=str)
                }
        
        elif method == 'POST':
            # Создание новости (только для руководителя)
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            # Проверка роли
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT role FROM t_p35759334_music_label_portal.users WHERE id = %s', (user_id,))
                user = cur.fetchone()
                
                if not user or user['role'] != 'director':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Only director can create news'})
                    }
            
            body = json.loads(event.get('body', '{}'))
            title = body.get('title')
            content = body.get('content')
            news_type = body.get('type', 'update')
            priority = body.get('priority', 0)
            image_url = body.get('image_url')
            poll = body.get('poll')
            
            if not title or not content:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title and content are required'})
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    INSERT INTO t_p35759334_music_label_portal.news 
                    (title, content, type, priority, image_url, created_by)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, title, content, type, is_active, priority, image_url, created_at, updated_at, created_by
                ''', (title, content, news_type, priority, image_url, user_id))
                
                new_item = cur.fetchone()
                news_id = new_item['id']
                
                # Если есть опрос, создаем его
                if poll and poll.get('question') and poll.get('options'):
                    cur.execute('''
                        INSERT INTO t_p35759334_music_label_portal.news_polls (news_id, question)
                        VALUES (%s, %s)
                        RETURNING id
                    ''', (news_id, poll['question']))
                    poll_data = cur.fetchone()
                    poll_id = poll_data['id']
                    
                    # Добавляем варианты ответов
                    for option in poll['options']:
                        if option.strip():
                            cur.execute('''
                                INSERT INTO t_p35759334_music_label_portal.poll_options (poll_id, option_text)
                                VALUES (%s, %s)
                            ''', (poll_id, option.strip()))
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(dict(new_item), default=str)
                }
        
        elif method == 'PUT':
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            # Голосование в опросе
            if action == 'vote':
                poll_id = body.get('poll_id')
                option_id = body.get('option_id')
                
                if not poll_id or not option_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'poll_id and option_id are required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Проверяем, не голосовал ли уже
                    cur.execute('''
                        SELECT id FROM t_p35759334_music_label_portal.poll_votes
                        WHERE poll_id = %s AND user_id = %s
                    ''', (poll_id, user_id))
                    
                    if cur.fetchone():
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'You have already voted'})
                        }
                    
                    # Добавляем голос
                    cur.execute('''
                        INSERT INTO t_p35759334_music_label_portal.poll_votes (poll_id, option_id, user_id)
                        VALUES (%s, %s, %s)
                    ''', (poll_id, option_id, user_id))
                    
                    # Увеличиваем счётчик
                    cur.execute('''
                        UPDATE t_p35759334_music_label_portal.poll_options
                        SET votes_count = votes_count + 1
                        WHERE id = %s
                    ''', (option_id,))
                    
                    conn.commit()
                    
                    # Возвращаем обновлённые результаты
                    cur.execute('''
                        SELECT id, option_text, votes_count
                        FROM t_p35759334_music_label_portal.poll_options
                        WHERE poll_id = %s
                        ORDER BY id
                    ''', (poll_id,))
                    options = cur.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'options': [dict(opt) for opt in options]
                        }, default=str)
                    }
            
            # Обновление новости (только для руководителя)
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT role FROM t_p35759334_music_label_portal.users WHERE id = %s', (user_id,))
                user = cur.fetchone()
                
                if not user or user['role'] != 'director':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Only director can update news'})
                    }
            
            news_id = body.get('id')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'News ID is required'})
                }
            
            updates = []
            params_list = []
            
            if 'title' in body:
                updates.append('title = %s')
                params_list.append(body['title'])
            if 'content' in body:
                updates.append('content = %s')
                params_list.append(body['content'])
            if 'type' in body:
                updates.append('type = %s')
                params_list.append(body['type'])
            if 'is_active' in body:
                updates.append('is_active = %s')
                params_list.append(body['is_active'])
            if 'priority' in body:
                updates.append('priority = %s')
                params_list.append(body['priority'])
            if 'image_url' in body:
                updates.append('image_url = %s')
                params_list.append(body['image_url'])
            
            updates.append('updated_at = CURRENT_TIMESTAMP')
            params_list.append(news_id)
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    UPDATE t_p35759334_music_label_portal.news 
                    SET {', '.join(updates)}
                    WHERE id = %s
                    RETURNING id, title, content, type, is_active, priority, image_url, created_at, updated_at, created_by
                ''', params_list)
                
                updated_item = cur.fetchone()
                conn.commit()
                
                if not updated_item:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'News not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(dict(updated_item), default=str)
                }
        
        elif method == 'DELETE':
            # Удаление новости (только для руководителя)
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            # Проверка роли
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT role FROM t_p35759334_music_label_portal.users WHERE id = %s', (user_id,))
                user = cur.fetchone()
                
                if not user or user['role'] != 'director':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Only director can delete news'})
                    }
            
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'News ID is required'})
                }
            
            with conn.cursor() as cur:
                cur.execute('DELETE FROM t_p35759334_music_label_portal.news WHERE id = %s', (news_id,))
                conn.commit()
                
                if cur.rowcount == 0:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'News not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'News deleted successfully'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        conn.close()