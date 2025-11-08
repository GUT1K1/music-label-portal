import json
import os
import psycopg2
from typing import Dict, Any, List
import openpyxl
from io import BytesIO
import base64

def normalize_string(s: str) -> str:
    """Нормализует строку для сравнения: убирает пробелы, спецсимволы, приводит к lowercase"""
    if not s:
        return ""
    s = s.strip().lower()
    s = s.replace('«', '').replace('»', '').replace('"', '').replace('"', '')
    s = s.replace('(', '').replace(')', '').replace('[', '').replace(']', '')
    s = ' '.join(s.split())
    return s

def match_report_to_releases(artist_name: str, album_name: str, cursor) -> tuple:
    """
    Ищет совпадение в БД по имени артиста и названию альбома.
    Возвращает (user_id, release_id) или (None, None)
    """
    normalized_artist = normalize_string(artist_name)
    normalized_album = normalize_string(album_name)
    
    cursor.execute("""
        SELECT r.id, r.user_id 
        FROM releases r
        WHERE LOWER(TRIM(COALESCE(r.artist_name, ''))) = %s 
        AND LOWER(TRIM(r.release_name)) = %s
        LIMIT 1
    """, (normalized_artist, normalized_album))
    
    result = cursor.fetchone()
    if result:
        return (result[1], result[0])
    return (None, None)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Загрузка и парсинг финансового отчёта из Excel
    Args: event с httpMethod, body (base64 Excel file), queryStringParameters (period, adminUserId)
    Returns: HTTP response с результатами парсинга и сопоставления
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            file_base64 = body_data.get('file')
            period = body_data.get('period')
            admin_user_id = body_data.get('adminUserId')
            
            if not file_base64 or not period or not admin_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields: file, period, adminUserId'})
                }
            
            file_bytes = base64.b64decode(file_base64)
            workbook = openpyxl.load_workbook(BytesIO(file_bytes))
            sheet = workbook.active
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            parsed_rows = []
            matched_count = 0
            unmatched_rows = []
            
            for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
                if not row or len(row) < 15:
                    continue
                
                artist_name = str(row[6]) if row[6] else ""
                album_name = str(row[8]) if row[8] else ""
                amount_str = str(row[14]) if row[14] else "0"
                
                if not artist_name or not album_name:
                    continue
                
                try:
                    amount = float(amount_str.replace(',', '.').replace(' ', ''))
                except (ValueError, AttributeError):
                    amount = 0.0
                
                user_id, release_id = match_report_to_releases(artist_name, album_name, cursor)
                
                parsed_row = {
                    'row_number': row_idx,
                    'artist_name': artist_name,
                    'album_name': album_name,
                    'amount': amount,
                    'user_id': user_id,
                    'release_id': release_id,
                    'matched': user_id is not None
                }
                
                parsed_rows.append(parsed_row)
                
                if user_id:
                    matched_count += 1
                    cursor.execute("""
                        INSERT INTO financial_reports 
                        (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, 'matched')
                    """, (period, artist_name, album_name, amount, user_id, release_id, admin_user_id))
                    
                    cursor.execute("""
                        UPDATE users 
                        SET balance = balance + %s 
                        WHERE id = %s
                    """, (amount, user_id))
                else:
                    unmatched_rows.append(parsed_row)
                    cursor.execute("""
                        INSERT INTO financial_reports 
                        (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                        VALUES (%s, %s, %s, %s, NULL, NULL, %s, 'pending')
                    """, (period, artist_name, album_name, amount, admin_user_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'total_rows': len(parsed_rows),
                    'matched_count': matched_count,
                    'unmatched_count': len(unmatched_rows),
                    'unmatched_rows': unmatched_rows[:10],
                    'period': period
                })
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
