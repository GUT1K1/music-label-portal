"""
Business: Worker для обработки финансовых отчётов из очереди
Args: event - HTTP trigger или cron, context - execution context
Returns: HTTP 200 с количеством обработанных задач
"""

import json
import os
import psycopg2
from typing import Dict, Any
import openpyxl
from io import BytesIO

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
    """Загружает все релизы из БД один раз в память"""
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
    
    return releases_map

def match_report_to_releases(artist_name: str, album_name: str, releases_map: Dict[str, tuple]) -> tuple:
    """Ищет совпадение в загруженном словаре релизов"""
    normalized_artist = normalize_string(artist_name)
    normalized_album = normalize_string(album_name)
    
    if not normalized_artist or not normalized_album:
        return (None, None)
    
    key = f"{normalized_artist}||{normalized_album}"
    
    if key in releases_map:
        user_id, release_id, _ = releases_map[key]
        return (user_id, release_id)
    
    return (None, None)

def process_one_job(job_id: int, file_data: bytes, period: str, admin_user_id: int, cursor, conn) -> dict:
    """Обрабатывает один файл из очереди"""
    print(f"[WORKER] Processing job {job_id}...")
    
    workbook = openpyxl.load_workbook(BytesIO(file_data), read_only=True, data_only=True)
    sheet = workbook.active
    
    releases_map = load_all_releases(cursor)
    print(f"[WORKER] Loaded {len(releases_map)} releases")
    
    matched_count = 0
    artist_totals = {}
    batch_reports = []
    batch_updates = {}
    total_rows = 0
    batch_size = 1000
    
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
        
        user_id, release_id = match_report_to_releases(artist_name, album_name, releases_map)
        
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
            matched_batch = [r[:7] for r in batch_reports if r[7]]
            unmatched_batch = [(r[0], r[1], r[2], r[3], r[6]) for r in batch_reports if not r[7]]
            
            if matched_batch:
                cursor.executemany("""
                    INSERT INTO financial_reports 
                    (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'matched')
                """, matched_batch)
            
            if unmatched_batch:
                cursor.executemany("""
                    INSERT INTO financial_reports 
                    (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                    VALUES (%s, %s, %s, %s, NULL, NULL, %s, 'pending')
                """, unmatched_batch)
            
            cursor.execute("""
                UPDATE financial_upload_jobs 
                SET processed_rows = %s
                WHERE id = %s
            """, (total_rows, job_id))
            
            conn.commit()
            print(f"[WORKER] Job {job_id}: Committed {len(batch_reports)} records at row {row_idx}")
            batch_reports = []
    
    if batch_reports:
        matched_batch = [r[:7] for r in batch_reports if r[7]]
        unmatched_batch = [(r[0], r[1], r[2], r[3], r[6]) for r in batch_reports if not r[7]]
        
        if matched_batch:
            cursor.executemany("""
                INSERT INTO financial_reports 
                (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'matched')
            """, matched_batch)
        
        if unmatched_batch:
            cursor.executemany("""
                INSERT INTO financial_reports 
                (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                VALUES (%s, %s, %s, %s, NULL, NULL, %s, 'pending')
            """, unmatched_batch)
        
        conn.commit()
        print(f"[WORKER] Job {job_id}: Committed final {len(batch_reports)} records")
    
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
    Business: Worker для обработки очереди финансовых отчётов
    Args: event - HTTP/cron trigger, context - execution metadata
    Returns: HTTP 200 с результатами обработки
    """
    method = event.get('httpMethod', 'GET')
    
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = None
    cursor = None
    processed_count = 0
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, file_data, period, uploaded_by, total_rows
            FROM financial_upload_jobs
            WHERE status = 'pending'
            ORDER BY created_at ASC
            LIMIT 5
        """)
        
        jobs = cursor.fetchall()
        print(f"[WORKER] Found {len(jobs)} pending jobs")
        
        for job in jobs:
            job_id, file_data, period, admin_user_id, expected_total = job
            
            if not file_data:
                cursor.execute("""
                    UPDATE financial_upload_jobs 
                    SET status = 'failed', 
                        error_message = 'No file data found',
                        completed_at = NOW()
                    WHERE id = %s
                """, (job_id,))
                conn.commit()
                continue
            
            cursor.execute("""
                UPDATE financial_upload_jobs 
                SET status = 'processing', started_at = NOW()
                WHERE id = %s
            """, (job_id,))
            conn.commit()
            
            try:
                result = process_one_job(job_id, file_data, period, admin_user_id, cursor, conn)
                
                cursor.execute("""
                    UPDATE financial_upload_jobs 
                    SET status = 'completed', 
                        completed_at = NOW(),
                        total_rows = %s,
                        processed_rows = %s,
                        matched_count = %s,
                        unmatched_count = %s
                    WHERE id = %s
                """, (result['total_rows'], result['total_rows'], 
                      result['matched_count'], result['unmatched_count'], job_id))
                conn.commit()
                
                print(f"[WORKER] ✅ Job {job_id} completed: {result['matched_count']}/{result['total_rows']} matched")
                processed_count += 1
                
            except Exception as job_error:
                error_msg = f"Processing error: {str(job_error)}"
                print(f"[WORKER] ❌ Job {job_id} failed: {error_msg}")
                
                cursor.execute("""
                    UPDATE financial_upload_jobs 
                    SET status = 'failed', 
                        completed_at = NOW(),
                        error_message = %s
                    WHERE id = %s
                """, (error_msg, job_id))
                conn.commit()
        
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'processed': processed_count,
                'pending_jobs': len(jobs)
            })
        }
        
    except Exception as e:
        print(f"[WORKER] Fatal error: {str(e)}")
        
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
            'body': json.dumps({'error': str(e)})
        }
