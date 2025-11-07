import json
import os
from typing import Dict, Any
import boto3
from collections import defaultdict
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Aggressive cleanup - remove old files, duplicates, and specific patterns
    Args: event - dict with httpMethod, body with {"mode": "aggressive" or "normal"}
          context - object with request_id
    Returns: HTTP response with cleanup stats
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_str = event.get('body') or '{}'
        body = json.loads(body_str) if body_str else {}
        mode = body.get('mode', 'aggressive')
        days_to_keep = 3 if mode == 'aggressive' else 30
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        
        print(f"Cleanup mode: {mode}, keeping files newer than {cutoff_date.isoformat()}")
        
        access_key = os.environ.get('YC_S3_ACCESS_KEY_ID')
        secret_key = os.environ.get('YC_S3_SECRET_ACCESS_KEY')
        bucket_name = os.environ.get('YC_S3_BUCKET_NAME')
        
        s3_client = boto3.client(
            's3',
            endpoint_url='https://storage.yandexcloud.net',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='ru-central1'
        )
        
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=bucket_name, Prefix='uploads/')
        
        files_by_size = defaultdict(list)
        files_with_rastvoritель = []
        old_files = []
        total_files = 0
        total_size = 0
        
        print("Scanning bucket...")
        
        for page in pages:
            if 'Contents' not in page:
                continue
                
            for obj in page['Contents']:
                key = obj['Key']
                size = obj['Size']
                last_modified = obj['LastModified'].replace(tzinfo=None)
                total_files += 1
                total_size += size
                
                if 'Rasтворитель' in key or 'rastvoritель' in key.lower():
                    files_with_rastvoritель.append({
                        'key': key,
                        'size': size,
                        'last_modified': last_modified.isoformat()
                    })
                
                if last_modified < cutoff_date:
                    old_files.append({
                        'key': key,
                        'size': size,
                        'last_modified': last_modified.isoformat()
                    })
                
                files_by_size[size].append({
                    'key': key,
                    'last_modified': last_modified
                })
        
        print(f"Total: {total_files} files, {total_size / (1024**3):.2f} GB")
        print(f"Rastvoritель files: {len(files_with_rastvoritель)}")
        print(f"Old files (>{days_to_keep} days): {len(old_files)}")
        
        deleted_rastvoritель = []
        for file_info in files_with_rastvoritель:
            try:
                s3_client.delete_object(Bucket=bucket_name, Key=file_info['key'])
                deleted_rastvoritель.append(file_info)
                print(f"Deleted Rastvoritель: {file_info['key']}")
            except Exception as e:
                print(f"Failed: {e}")
        
        deleted_old = []
        for file_info in old_files:
            try:
                s3_client.delete_object(Bucket=bucket_name, Key=file_info['key'])
                deleted_old.append(file_info)
                if len(deleted_old) % 50 == 0:
                    print(f"Deleted {len(deleted_old)} old files...")
            except Exception as e:
                print(f"Failed old: {e}")
        
        deleted_duplicates = []
        dup_freed_size = 0
        
        for size, files in files_by_size.items():
            if len(files) > 1:
                files_sorted = sorted(files, key=lambda x: x['last_modified'], reverse=True)
                files_to_delete = files_sorted[1:]
                
                for file_info in files_to_delete:
                    try:
                        s3_client.delete_object(Bucket=bucket_name, Key=file_info['key'])
                        deleted_duplicates.append({'key': file_info['key'], 'size': size})
                        dup_freed_size += size
                    except Exception as e:
                        pass
        
        rastvoritель_size = sum(f['size'] for f in deleted_rastvoritель)
        old_files_size = sum(f['size'] for f in deleted_old)
        total_freed = rastvoritель_size + old_files_size + dup_freed_size
        
        result = {
            'success': True,
            'mode': mode,
            'stats': {
                'total_files_scanned': total_files,
                'total_size_gb': round(total_size / (1024**3), 2),
                'deleted_rastvoritель_count': len(deleted_rastvoritель),
                'deleted_rastvoritель_size_mb': round(rastvoritель_size / (1024**2), 2),
                'deleted_old_files_count': len(deleted_old),
                'deleted_old_files_size_mb': round(old_files_size / (1024**2), 2),
                'deleted_duplicates_count': len(deleted_duplicates),
                'deleted_duplicates_size_mb': round(dup_freed_size / (1024**2), 2),
                'total_freed_mb': round(total_freed / (1024**2), 2),
                'total_freed_gb': round(total_freed / (1024**3), 2),
                'remaining_files': total_files - len(deleted_rastvoritель) - len(deleted_old) - len(deleted_duplicates),
                'remaining_size_gb': round((total_size - total_freed) / (1024**3), 2)
            }
        }
        
        print(f"Cleanup complete: freed {total_freed / (1024**3):.2f} GB")
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Cleanup error: {e}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }