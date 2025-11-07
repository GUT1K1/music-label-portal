import json
import os
from typing import Dict, Any
import boto3
from collections import defaultdict

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Cleanup S3 storage - remove duplicates and specific files
    Args: event - dict with httpMethod, queryStringParameters
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
        
        # Получаем список всех файлов
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=bucket_name, Prefix='uploads/')
        
        # Группируем файлы по размеру для поиска дубликатов
        files_by_size = defaultdict(list)
        files_with_rastvoritель = []
        total_files = 0
        total_size = 0
        
        print("Scanning bucket for files...")
        
        for page in pages:
            if 'Contents' not in page:
                continue
                
            for obj in page['Contents']:
                key = obj['Key']
                size = obj['Size']
                total_files += 1
                total_size += size
                
                # Ищем файлы с "Rasтворитель" в названии
                if 'Rasтворитель' in key or 'rastvoritель' in key.lower():
                    files_with_rastvoritель.append({
                        'key': key,
                        'size': size,
                        'last_modified': obj['LastModified'].isoformat()
                    })
                
                # Группируем по размеру для поиска дубликатов
                files_by_size[size].append({
                    'key': key,
                    'last_modified': obj['LastModified']
                })
        
        print(f"Total files: {total_files}, Total size: {total_size / (1024**3):.2f} GB")
        print(f"Files with 'Rasтворитель': {len(files_with_rastvoritель)}")
        
        # Удаляем файлы с "Rasтворитель"
        deleted_rastvoritель = []
        for file_info in files_with_rastvoritель:
            try:
                s3_client.delete_object(Bucket=bucket_name, Key=file_info['key'])
                deleted_rastvoritель.append(file_info)
                print(f"Deleted Rasтворitель file: {file_info['key']}, size: {file_info['size']} bytes")
            except Exception as e:
                print(f"Failed to delete {file_info['key']}: {e}")
        
        # Находим и удаляем дубликаты (оставляем только самый новый файл)
        deleted_duplicates = []
        freed_size = 0
        
        for size, files in files_by_size.items():
            if len(files) > 1:
                # Сортируем по дате, оставляем самый новый
                files_sorted = sorted(files, key=lambda x: x['last_modified'], reverse=True)
                files_to_delete = files_sorted[1:]  # Удаляем все кроме первого (самого нового)
                
                for file_info in files_to_delete:
                    try:
                        s3_client.delete_object(Bucket=bucket_name, Key=file_info['key'])
                        deleted_duplicates.append({
                            'key': file_info['key'],
                            'size': size
                        })
                        freed_size += size
                        print(f"Deleted duplicate: {file_info['key']}, size: {size} bytes")
                    except Exception as e:
                        print(f"Failed to delete duplicate {file_info['key']}: {e}")
        
        rastvoritель_size = sum(f['size'] for f in deleted_rastvoritель)
        total_freed = freed_size + rastvoritель_size
        
        result = {
            'success': True,
            'stats': {
                'total_files_scanned': total_files,
                'total_size_gb': round(total_size / (1024**3), 2),
                'deleted_rastvoritель_count': len(deleted_rastvoritель),
                'deleted_rastvoritель_size_mb': round(rastvoritель_size / (1024**2), 2),
                'deleted_duplicates_count': len(deleted_duplicates),
                'deleted_duplicates_size_mb': round(freed_size / (1024**2), 2),
                'total_freed_mb': round(total_freed / (1024**2), 2),
                'total_freed_gb': round(total_freed / (1024**3), 2)
            },
            'deleted_rastvoritель_files': [f['key'] for f in deleted_rastvoritель[:10]],  # Показываем первые 10
            'deleted_duplicates_sample': [f['key'] for f in deleted_duplicates[:10]]  # Показываем первые 10
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
