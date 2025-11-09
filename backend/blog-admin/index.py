import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime
import re

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug[:200]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления блогом (создание, редактирование, удаление статей)
    Args: event с httpMethod, body, pathParams
    Returns: HTTP response с данными статей
    '''
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
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        
        if not user_row or user_row[0] != 'director':
            cursor.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Access denied. Director role required.'})
            }
        
        if method == 'GET':
            cursor.execute("""
                SELECT id, title, slug, excerpt, content, image_url, video_url, 
                       category, author_id, created_at, updated_at, published
                FROM blog_posts 
                ORDER BY created_at DESC
            """)
            
            posts = []
            for row in cursor.fetchall():
                posts.append({
                    'id': row[0],
                    'title': row[1],
                    'slug': row[2],
                    'excerpt': row[3],
                    'content': row[4],
                    'image_url': row[5],
                    'video_url': row[6],
                    'category': row[7],
                    'author_id': row[8],
                    'created_at': row[9].isoformat() if row[9] else None,
                    'updated_at': row[10].isoformat() if row[10] else None,
                    'published': row[11]
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'posts': posts})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            title = body.get('title', '').strip()
            content = body.get('content', '').strip()
            
            if not title or not content:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title and content are required'})
                }
            
            slug = body.get('slug') or generate_slug(title)
            excerpt = body.get('excerpt', '')
            image_url = body.get('image_url')
            video_url = body.get('video_url')
            category = body.get('category', 'Общее')
            published = body.get('published', True)
            
            cursor.execute("""
                INSERT INTO blog_posts (title, slug, excerpt, content, image_url, video_url, 
                                       category, author_id, published, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                RETURNING id, created_at
            """, (title, slug, excerpt, content, image_url, video_url, category, user_id, published))
            
            post_id, created_at = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': post_id,
                    'slug': slug,
                    'created_at': created_at.isoformat()
                })
            }
        
        elif method == 'PUT':
            path_params = event.get('pathParams', {})
            post_id = path_params.get('id')
            
            if not post_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID is required'})
                }
            
            body = json.loads(event.get('body', '{}'))
            
            update_fields = []
            update_values = []
            
            if 'title' in body:
                update_fields.append('title = %s')
                update_values.append(body['title'])
            if 'slug' in body:
                update_fields.append('slug = %s')
                update_values.append(body['slug'])
            if 'excerpt' in body:
                update_fields.append('excerpt = %s')
                update_values.append(body['excerpt'])
            if 'content' in body:
                update_fields.append('content = %s')
                update_values.append(body['content'])
            if 'image_url' in body:
                update_fields.append('image_url = %s')
                update_values.append(body['image_url'])
            if 'video_url' in body:
                update_fields.append('video_url = %s')
                update_values.append(body['video_url'])
            if 'category' in body:
                update_fields.append('category = %s')
                update_values.append(body['category'])
            if 'published' in body:
                update_fields.append('published = %s')
                update_values.append(body['published'])
            
            update_fields.append('updated_at = NOW()')
            update_values.append(post_id)
            
            query = f"UPDATE blog_posts SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(query, update_values)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams', {})
            post_id = path_params.get('id')
            
            if not post_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID is required'})
                }
            
            cursor.execute("UPDATE blog_posts SET published = false WHERE id = %s", (post_id,))
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        cursor.close()
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
