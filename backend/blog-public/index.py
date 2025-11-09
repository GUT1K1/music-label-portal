import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Публичное API для получения опубликованных статей блога
    Args: event с httpMethod, queryStringParameters
    Returns: HTTP response со списком статей или одной статьей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        query_params = event.get('queryStringParameters', {})
        slug = query_params.get('slug') if query_params else None
        
        if slug:
            cursor.execute("""
                SELECT id, title, slug, excerpt, content, image_url, video_url, 
                       category, created_at, updated_at
                FROM blog_posts 
                WHERE slug = %s AND published = true
            """, (slug,))
            
            row = cursor.fetchone()
            if not row:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'})
                }
            
            post = {
                'id': row[0],
                'title': row[1],
                'slug': row[2],
                'excerpt': row[3],
                'content': row[4],
                'image_url': row[5],
                'video_url': row[6],
                'category': row[7],
                'date': row[8].strftime('%d.%m.%Y') if row[8] else '',
                'isoDate': row[8].isoformat() if row[8] else None,
                'readTime': f"{max(1, len(row[4].split()) // 200)} мин"
            }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'post': post})
            }
        
        cursor.execute("""
            SELECT id, title, slug, excerpt, content, image_url, video_url, 
                   category, created_at
            FROM blog_posts 
            WHERE published = true
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
                'date': row[8].strftime('%d.%m.%Y') if row[8] else '',
                'isoDate': row[8].isoformat() if row[8] else None,
                'readTime': f"{max(1, len(row[4].split()) // 200)} мин"
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'posts': posts})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
