import json
import os
import psycopg2
from typing import Dict, Any
import openpyxl
from io import BytesIO
import urllib.request

def normalize_string(s: str) -> str:
    if not s:
        return ""
    s = s.strip().lower()
    s = s.replace('«', '').replace('»', '').replace('"', '').replace('"', '')
    s = s.replace('(', '').replace(')', '').replace('[', '').replace(']', '')
    s = ' '.join(s.split())
    return s

def load_all_releases(cursor) -> Dict[str, tuple]:
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
    normalized_artist = normalize_string(artist_name)
    normalized_album = normalize_string(album_name)
    
    if not normalized_artist or not normalized_album:
        return (None, None)
    
    key = f"{normalized_artist}||{normalized_album}"
    
    if key in releases_map:
        user_id, release_id, _ = releases_map[key]
        return (user_id, release_id)
    
    return (None, None)

def process_chunk(chunk_id: int, job_id: int, start_row: int, end_row: int, 
                  file_data: bytes, period: str, admin_user_id: int, 
                  releases_map: Dict[str, tuple], cursor, conn) -> dict:
    """Обрабатывает один чанк файла"""
    print(f"[CHUNK {chunk_id}] Processing rows {start_row}-{end_row}")
    
    workbook = openpyxl.load_workbook(BytesIO(file_data), read_only=True, data_only=True)
    sheet = workbook.active
    
    matched_count = 0
    batch_reports = []
    batch_updates = {}
    processed_rows = 0
    current_row = 0
    
    for row in sheet.iter_rows(min_row=2, values_only=True):
        current_row += 1
        
        if current_row < start_row:
            continue
        if current_row > end_row:
            break
        
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
        
        processed_rows += 1
        
        if user_id:
            matched_count += 1
            batch_reports.append((period, artist_name, album_name, amount, user_id, release_id, admin_user_id, True))
            
            if user_id not in batch_updates:
                batch_updates[user_id] = 0
            batch_updates[user_id] += amount
        else:
            batch_reports.append((period, artist_name, album_name, amount, None, None, admin_user_id, False))
    
    if batch_reports:
        matched_batch = [r[:7] for r in batch_reports if r[7]]
        unmatched_batch = [(r[0], r[1], r[2], r[3], r[6]) for r in batch_reports if not r[7]]
        
        if matched_batch:
            values_str = ','.join(
                cursor.mogrify("(%s,%s,%s,%s,%s,%s,%s,'matched')", row).decode('utf-8')
                for row in matched_batch
            )
            cursor.execute(f"""
                INSERT INTO financial_reports 
                (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status)
                VALUES {values_str}
            """)
        
        if unmatched_batch:
            values_str = ','.join(
                cursor.mogrify("(%s,%s,%s,%s,%s,'pending')", row).decode('utf-8')
                for row in unmatched_batch
            )
            cursor.execute(f"""
                INSERT INTO financial_reports 
                (period, artist_name, album_name, amount, uploaded_by, status)
                VALUES {values_str}
            """)
        
        conn.commit()
    
    cursor.execute("""
        UPDATE job_chunks
        SET status = 'completed',
            matched_count = %s,
            processed_rows = %s,
            completed_at = NOW()
        WHERE id = %s
    """, (matched_count, processed_rows, chunk_id))
    conn.commit()
    
    print(f"[CHUNK {chunk_id}] Completed: {processed_rows} rows, {matched_count} matched")
    
    return {
        'chunk_id': chunk_id,
        'processed_rows': processed_rows,
        'matched_count': matched_count,
        'balance_updates': batch_updates
    }

def finalize_job(job_id: int, cursor, conn) -> bool:
    """Завершает обработку задачи и обновляет балансы. Возвращает True если остались чанки"""
    cursor.execute("""
        SELECT COUNT(*), SUM(processed_rows), SUM(matched_count)
        FROM job_chunks
        WHERE job_id = %s AND status = 'completed'
    """, (job_id,))
    completed_chunks, total_processed, total_matched = cursor.fetchone()
    
    cursor.execute("""
        SELECT total_chunks FROM financial_upload_jobs WHERE id = %s
    """, (job_id,))
    total_chunks = cursor.fetchone()[0]
    
    cursor.execute("""
        UPDATE financial_upload_jobs
        SET completed_chunks = %s,
            processed_rows = %s,
            matched_count = %s,
            unmatched_count = %s - %s
        WHERE id = %s
    """, (completed_chunks, total_processed, total_matched, total_processed, total_matched, job_id))
    
    has_more_chunks = completed_chunks < total_chunks
    
    if completed_chunks >= total_chunks:
        cursor.execute("""
            SELECT user_id, SUM(amount) as total_amount
            FROM financial_reports
            WHERE uploaded_by IN (SELECT uploaded_by FROM financial_upload_jobs WHERE id = %s)
              AND period = (SELECT period FROM financial_upload_jobs WHERE id = %s)
              AND status = 'matched'
              AND uploaded_at >= (SELECT created_at FROM financial_upload_jobs WHERE id = %s)
            GROUP BY user_id
        """, (job_id, job_id, job_id))
        
        for user_id, total_amount in cursor.fetchall():
            cursor.execute("""
                UPDATE users
                SET balance = balance + %s
                WHERE id = %s
            """, (total_amount, user_id))
        
        cursor.execute("""
            UPDATE financial_upload_jobs
            SET status = 'completed',
                completed_at = NOW()
            WHERE id = %s
        """, (job_id,))
        
        print(f"[JOB {job_id}] ✅ Completed and balances updated")
    else:
        print(f"[JOB {job_id}] Progress: {completed_chunks}/{total_chunks} chunks")
    
    conn.commit()
    return has_more_chunks

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Worker для обработки финансовых отчётов по чанкам
    Args: event с httpMethod GET
    Returns: Статус обработки чанков
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
    
    if method == 'GET':
        try:
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT jc.id, jc.job_id, jc.start_row, jc.end_row,
                       fuj.file_data, fuj.period, fuj.uploaded_by
                FROM job_chunks jc
                JOIN financial_upload_jobs fuj ON jc.job_id = fuj.id
                WHERE jc.status = 'pending'
                ORDER BY jc.job_id, jc.chunk_number
                LIMIT 3
            """)
            
            pending_chunks = cursor.fetchall()
            
            if not pending_chunks:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'success': True,
                        'processed': 0,
                        'message': 'No pending chunks'
                    })
                }
            
            cursor.execute("""
                UPDATE job_chunks
                SET status = 'processing', started_at = NOW()
                WHERE id IN %s
            """, (tuple(chunk[0] for chunk in pending_chunks),))
            conn.commit()
            
            releases_map = load_all_releases(cursor)
            print(f"[WORKER] Loaded {len(releases_map)} releases")
            
            processed_jobs = set()
            total_processed = 0
            
            for chunk_id, job_id, start_row, end_row, file_data, period, admin_user_id in pending_chunks:
                try:
                    cursor.execute("""
                        UPDATE financial_upload_jobs
                        SET status = 'processing', started_at = COALESCE(started_at, NOW())
                        WHERE id = %s AND status = 'pending'
                    """, (job_id,))
                    conn.commit()
                    
                    result = process_chunk(
                        chunk_id, job_id, start_row, end_row,
                        bytes(file_data), period, admin_user_id,
                        releases_map, cursor, conn
                    )
                    
                    processed_jobs.add(job_id)
                    total_processed += 1
                    
                except Exception as e:
                    print(f"[CHUNK {chunk_id}] ❌ Error: {str(e)}")
                    cursor.execute("""
                        UPDATE job_chunks
                        SET status = 'failed', error_message = %s
                        WHERE id = %s
                    """, (str(e), chunk_id))
                    conn.commit()
            
            has_more_chunks = False
            for job_id in processed_jobs:
                if finalize_job(job_id, cursor, conn):
                    has_more_chunks = True
            
            cursor.close()
            conn.close()
            
            if has_more_chunks and total_processed > 0:
                function_url = os.environ.get('SELF_URL')
                if function_url:
                    print(f"[WORKER] 🔄 Auto-triggering next batch...")
                    try:
                        req = urllib.request.Request(
                            function_url,
                            method='GET',
                            headers={'Content-Type': 'application/json'}
                        )
                        urllib.request.urlopen(req, timeout=2)
                    except Exception as e:
                        print(f"[WORKER] Auto-trigger sent (fire-and-forget): {str(e)}")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'processed': total_processed,
                    'jobs': list(processed_jobs),
                    'has_more': has_more_chunks
                })
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"[WORKER] Fatal error: {error_msg}")
            
            try:
                if cursor:
                    cursor.close()
                if conn:
                    conn.close()
            except:
                pass
            
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': error_msg})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'})
    }