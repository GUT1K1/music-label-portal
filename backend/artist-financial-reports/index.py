import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Получение финансовых отчётов артиста с детальной статистикой
    Args: event с httpMethod, headers (X-User-Id)
    Returns: HTTP response со списком отчётов и статистикой
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
                    'body': json.dumps({'error': 'X-User-Id header required'})
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT 
                    id,
                    period,
                    artist_name,
                    album_name,
                    amount,
                    release_id,
                    uploaded_at,
                    status
                FROM financial_reports
                WHERE user_id = %s 
                  AND status = 'matched'
                  AND id > 2
                ORDER BY uploaded_at DESC, period DESC
            """, (user_id,))
            
            reports = []
            for row in cursor.fetchall():
                reports.append({
                    'id': row[0],
                    'period': row[1],
                    'artist_name': row[2],
                    'album_name': row[3],
                    'amount': float(row[4]),
                    'release_id': row[5],
                    'uploaded_at': row[6].isoformat() if row[6] else None,
                    'status': row[7]
                })
            
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(amount), 0) as total,
                    COUNT(*) as count
                FROM financial_reports
                WHERE user_id = %s 
                  AND status = 'matched'
                  AND id > 2
            """, (user_id,))
            
            stats_row = cursor.fetchone()
            total_earned = float(stats_row[0]) if stats_row else 0.0
            reports_count = stats_row[1] if stats_row else 0
            
            cursor.execute("""
                SELECT period, SUM(amount) as period_total
                FROM financial_reports
                WHERE user_id = %s 
                  AND status = 'matched'
                  AND id > 2
                GROUP BY period
                ORDER BY period DESC
            """, (user_id,))
            
            by_period = []
            for row in cursor.fetchall():
                by_period.append({
                    'period': row[0],
                    'total': float(row[1])
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'reports': reports,
                    'stats': {
                        'total_earned': total_earned,
                        'reports_count': reports_count,
                        'by_period': by_period
                    }
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