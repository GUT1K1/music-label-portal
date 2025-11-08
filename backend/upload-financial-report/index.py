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

def process_financial_report_sync(file_bytes: bytes, period: str, admin_user_id: int, cursor, conn) -> dict:
    """
    Синхронная обработка финансового отчёта с батч-коммитами
    """
    workbook = openpyxl.load_workbook(BytesIO(file_bytes))
    sheet = workbook.active
    
    releases_map = load_all_releases(cursor)
    print(f"[UPLOAD] Loaded {len(releases_map)} releases")
    
    matched_count = 0
    artist_totals = {}
    batch_reports = []
    batch_updates = {}
    total_rows = 0
    batch_size = 500
    
    for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
        if not row or len(row) < 14:
            continue
        
        artist_name = str(row[6]) if row[6] else ""
        album_name = str(row[8]) if row[8] else ""
        amount_str = str(row[13]) if row[13] else "0"
        
        if not artist_name:
            continue
        
        try:
            amount = float(amount_str.replace(',', '.').replace(' ', ''))
        except (ValueError, AttributeError):
            amount = 0.0
        
        user_id, release_id = match_report_to_releases(artist_name, album_name, releases_map, False)
        
        total_rows += 1
        
        if user_id:
            matched_count += 1
            batch_reports.append((period, artist_name, album_name, amount, user_id, release_id, admin_user_id, True))
            
            if user_id not in batch_updates:
                batch_updates[user_id] = 0
            batch_updates[user_id] += amount
            
            if artist_name not in artist_totals:
                artist_totals[artist_name] = {'count': 0, 'total': 0}
            artist_totals[artist_name]['count'] += 1
            artist_totals[artist_name]['total'] += amount
        else:
            batch_reports.append((period, artist_name, album_name, amount, None, None, admin_user_id, False))
        
        if len(batch_reports) >= batch_size:
            for report in batch_reports:
                if report[7]:
                    cursor.execute("""
                        INSERT INTO financial_reports 
                        (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, 'matched')
                    """, report[:7])
                else:
                    cursor.execute("""
                        INSERT INTO financial_reports 
                        (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                        VALUES (%s, %s, %s, %s, NULL, NULL, %s, 'pending')
                    """, (report[0], report[1], report[2], report[3], report[6]))
            conn.commit()
            print(f"[BATCH] Committed {len(batch_reports)} records at row {row_idx}, matched: {matched_count}")
            batch_reports = []
    
    if batch_reports:
        for report in batch_reports:
            if report[7]:
                cursor.execute("""
                    INSERT INTO financial_reports 
                    (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'matched')
                """, report[:7])
            else:
                cursor.execute("""
                    INSERT INTO financial_reports 
                    (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                    VALUES (%s, %s, %s, %s, NULL, NULL, %s, 'pending')
                """, (report[0], report[1], report[2], report[3], report[6]))
        conn.commit()
        print(f"[FINAL] Committed final {len(batch_reports)} records")
    
    for user_id, total_amount in batch_updates.items():
        cursor.execute("""
            UPDATE users 
            SET balance = balance + %s 
            WHERE id = %s
        """, (total_amount, user_id))
    conn.commit()
    
    artist_summary = []
    for artist_name, data in artist_totals.items():
        artist_summary.append({
            'artist_name': artist_name,
            'count': data['count'],
            'total': data['total']
        })
    
    return {
        'total_rows': total_rows,
        'matched_count': matched_count,
        'unmatched_count': total_rows - matched_count,
        'artist_summary': artist_summary
    }

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
                       created_at, started_at, completed_at
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
                    'completed_at': row[11].isoformat() if row[11] else None
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
            
            cursor.execute("""
                INSERT INTO financial_upload_jobs (uploaded_by, period, filename, status, started_at)
                VALUES (%s, %s, %s, 'processing', NOW())
                RETURNING id
            """, (admin_user_id, period, filename))
            job_id = cursor.fetchone()[0]
            conn.commit()
            
            print(f"[UPLOAD] Processing job {job_id} for user {admin_user_id}")
            
            result = process_financial_report_sync(file_bytes, period, admin_user_id, cursor, conn)
            
            cursor.execute("""
                UPDATE financial_upload_jobs 
                SET status = 'completed', 
                    completed_at = NOW(),
                    total_rows = %s,
                    processed_rows = %s,
                    matched_count = %s,
                    unmatched_count = %s
                WHERE id = %s
            """, (result['total_rows'], result['total_rows'], result['matched_count'], result['unmatched_count'], job_id))
            conn.commit()
            
            cursor.close()
            conn.close()
            
            print(f"[UPLOAD] ✅ Job {job_id} completed: {result['matched_count']}/{result['total_rows']} matched")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'job_id': job_id,
                    'total_rows': result['total_rows'],
                    'matched_count': result['matched_count'],
                    'unmatched_count': result['unmatched_count'],
                    'artist_summary': result['artist_summary'],
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