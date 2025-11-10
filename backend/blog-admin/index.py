import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime
import re

def escape_sql_string(value: str) -> str:
    """Escape single quotes for Simple Query Protocol"""
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

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
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT role FROM users WHERE id = {user_id}")
    user_row = cursor.fetchone()
    
    if not user_row or user_row[0] != 'director':
        cursor.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Access denied. Director role required.'}),
            'isBase64Encoded': False
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
            'body': json.dumps({'posts': posts}),
            'isBase64Encoded': False
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
                'body': json.dumps({'error': 'Title and content are required'}),
                'isBase64Encoded': False
            }
        
        slug = body.get('slug') or generate_slug(title)
        excerpt = body.get('excerpt', '')
        image_url = body.get('image_url', '')
        video_url = body.get('video_url', '')
        category = body.get('category', 'Общее')
        published = body.get('published', True)
        
        # Use Simple Query Protocol - escape strings manually
        title_esc = escape_sql_string(title)
        slug_esc = escape_sql_string(slug)
        excerpt_esc = escape_sql_string(excerpt)
        content_esc = escape_sql_string(content)
        image_url_esc = escape_sql_string(image_url) if image_url else 'NULL'
        video_url_esc = escape_sql_string(video_url) if video_url else 'NULL'
        category_esc = escape_sql_string(category)
        published_val = 'TRUE' if published else 'FALSE'
        
        cursor.execute(f"""
            INSERT INTO blog_posts (title, slug, excerpt, content, image_url, video_url, 
                                   category, author_id, published, created_at, updated_at)
            VALUES ({title_esc}, {slug_esc}, {excerpt_esc}, {content_esc}, {image_url_esc}, {video_url_esc}, 
                    {category_esc}, {user_id}, {published_val}, NOW(), NOW())
            RETURNING id, created_at
        """)
        
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
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        post_id = body.get('id')
        
        if not post_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Post ID is required'}),
                'isBase64Encoded': False
            }
        
        update_fields = []
        
        if 'title' in body:
            update_fields.append(f"title = {escape_sql_string(body['title'])}")
        if 'slug' in body:
            update_fields.append(f"slug = {escape_sql_string(body['slug'])}")
        if 'excerpt' in body:
            update_fields.append(f"excerpt = {escape_sql_string(body['excerpt'])}")
        if 'content' in body:
            update_fields.append(f"content = {escape_sql_string(body['content'])}")
        if 'image_url' in body:
            img_val = escape_sql_string(body['image_url']) if body['image_url'] else 'NULL'
            update_fields.append(f"image_url = {img_val}")
        if 'video_url' in body:
            vid_val = escape_sql_string(body['video_url']) if body['video_url'] else 'NULL'
            update_fields.append(f"video_url = {vid_val}")
        if 'category' in body:
            update_fields.append(f"category = {escape_sql_string(body['category'])}")
        if 'published' in body:
            pub_val = 'TRUE' if body['published'] else 'FALSE'
            update_fields.append(f"published = {pub_val}")
        
        update_fields.append('updated_at = NOW()')
        
        query = f"UPDATE blog_posts SET {', '.join(update_fields)} WHERE id = {post_id}"
        cursor.execute(query)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        body = json.loads(event.get('body', '{}'))
        post_id = body.get('id')
        
        if not post_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Post ID is required'}),
                'isBase64Encoded': False
            }
        
        cursor.execute(f"UPDATE blog_posts SET published = FALSE WHERE id = {post_id}")
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
