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

def load_all_releases(cursor) -> Dict[str, tuple]:
    """
    Загружает все релизы из БД один раз.
    Возвращает словарь: {normalized_key: (user_id, release_id, artist_name)}
    """
    cursor.execute("""
        SELECT r.id, r.artist_id, r.artist_name, r.release_name
        FROM releases r
    """)
    
    releases_map = {}
    for row in cursor.fetchall():
        release_id, artist_id, artist_name, release_name = row
        
        normalized_artist = normalize_string(artist_name or "")
        normalized_album = normalize_string(release_name or "")
        
        if normalized_artist and normalized_album:
            key = f"{normalized_artist}||{normalized_album}"
            releases_map[key] = (artist_id, release_id, artist_name)
    
    print(f"[INIT] Loaded {len(releases_map)} releases into memory")
    return releases_map

def match_report_to_releases(artist_name: str, album_name: str, releases_map: Dict[str, tuple], debug_mode: bool = False) -> tuple:
    """
    Ищет совпадение в загруженном словаре релизов.
    Возвращает (user_id, release_id) или (None, None)
    """
    normalized_artist = normalize_string(artist_name)
    normalized_album = normalize_string(album_name)
    
    if not normalized_artist or not normalized_album:
        return (None, None)
    
    key = f"{normalized_artist}||{normalized_album}"
    
    if debug_mode:
        print(f"[MATCH] Looking for key: '{key}'")
    
    if key in releases_map:
        user_id, release_id, _ = releases_map[key]
        if debug_mode:
            print(f"[MATCH] ✅ FOUND! user_id={user_id}, release_id={release_id}")
        return (user_id, release_id)
    
    if debug_mode:
        print(f"[MATCH] ❌ NOT FOUND")
    return (None, None)

def count_file_rows(file_bytes: bytes) -> int:
    """Подсчитывает количество строк в Excel файле"""
    workbook = openpyxl.load_workbook(BytesIO(file_bytes), read_only=True, data_only=True)
    sheet = workbook.active
    total_rows = 0
    for row in sheet.iter_rows(min_row=2, values_only=True):
        if row and len(row) >= 14 and row[6]:
            total_rows += 1
    return total_rows

def create_job_chunks(job_id: int, total_rows: int, chunk_size: int, cursor, conn):
    """Создаёт чанки для обработки файла"""
    total_chunks = (total_rows + chunk_size - 1) // chunk_size
    
    for chunk_num in range(total_chunks):
        start_row = chunk_num * chunk_size + 2
        end_row = min((chunk_num + 1) * chunk_size + 1, total_rows + 1)
        
        cursor.execute("""
            INSERT INTO job_chunks 
            (job_id, chunk_number, start_row, end_row, status)
            VALUES (%s, %s, %s, %s, 'pending')
        """, (job_id, chunk_num, start_row, end_row))
    
    cursor.execute("""
        UPDATE financial_upload_jobs
        SET total_chunks = %s, chunk_size = %s
        WHERE id = %s
    """, (total_chunks, chunk_size, job_id))
    
    conn.commit()
    print(f"[UPLOAD] Created {total_chunks} chunks for job {job_id}")
    return total_chunks

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Загрузка финансового отчёта (асинхронная)
    Args: event с httpMethod, body (base64 Excel file), queryStringParameters (period, adminUserId)
    Returns: HTTP 202 - файл принят в обработку
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
    
    if method == 'GET':
        try:
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'X-User-Id required'})
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, period, filename, status, total_rows, processed_rows, 
                       matched_count, unmatched_count, error_message, 
                       created_at, started_at, completed_at, total_chunks, completed_chunks
                FROM financial_upload_jobs
                WHERE uploaded_by = %s
                ORDER BY created_at DESC
                LIMIT 20
            """, (user_id,))
            
            jobs = []
            for row in cursor.fetchall():
                jobs.append({
                    'id': row[0],
                    'period': row[1],
                    'filename': row[2],
                    'status': row[3],
                    'total_rows': row[4],
                    'processed_rows': row[5],
                    'matched_count': row[6],
                    'unmatched_count': row[7],
                    'error_message': row[8],
                    'created_at': row[9].isoformat() if row[9] else None,
                    'started_at': row[10].isoformat() if row[10] else None,
                    'completed_at': row[11].isoformat() if row[11] else None,
                    'total_chunks': row[12],
                    'completed_chunks': row[13],
                    'progress': round((row[13] / row[12] * 100) if row[12] and row[12] > 0 else 0, 1)
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'jobs': jobs})
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        conn = None
        cursor = None
        job_id = None
        
        try:
            body_data = json.loads(event.get('body', '{}'))
            file_base64 = body_data.get('file')
            period = body_data.get('period')
            admin_user_id = body_data.get('adminUserId')
            filename = body_data.get('filename', 'report.xlsx')
            
            if not file_base64 or not period or not admin_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields: file, period, adminUserId'})
                }
            
            file_bytes = base64.b64decode(file_base64)
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            total_rows = count_file_rows(file_bytes)
            print(f"[UPLOAD] File has {total_rows} rows")
            
            cursor.execute("""
                INSERT INTO financial_upload_jobs 
                (uploaded_by, period, filename, status, file_data, total_rows)
                VALUES (%s, %s, %s, 'pending', %s, %s)
                RETURNING id
            """, (admin_user_id, period, filename, psycopg2.Binary(file_bytes), total_rows))
            job_id = cursor.fetchone()[0]
            conn.commit()
            
            chunk_size = 1000
            total_chunks = create_job_chunks(job_id, total_rows, chunk_size, cursor, conn)
            
            cursor.close()
            conn.close()
            
            print(f"[UPLOAD] Created job {job_id} with {total_chunks} chunks")
            
            return {
                'statusCode': 202,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'job_id': job_id,
                    'message': f'File queued for processing ({total_chunks} chunks)',
                    'period': period,
                    'total_rows': total_rows,
                    'total_chunks': total_chunks
                })
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"[ERROR] Upload failed: {error_msg}")
            
            if job_id and cursor and conn:
                try:
                    cursor.execute("""
                        UPDATE financial_upload_jobs 
                        SET status = 'failed', 
                            error_message = %s
                        WHERE id = %s
                    """, (error_msg, job_id))
                    conn.commit()
                except:
                    pass
            
            if cursor:
                try:
                    cursor.close()
                except:
                    pass
            if conn:
                try:
                    conn.close()
                except:
                    pass
            
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': error_msg})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }