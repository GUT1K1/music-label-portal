"""
Business: Assemble S3 chunks into single file and upload to Telegram
Args: event - dict with httpMethod='POST', body with JSON {chunkKeys, fileName, contentType}
      context - object with request_id
Returns: Telegram file_id and URL
"""

import json
import os
import requests
import boto3
from typing import Dict, Any, List
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
        body_data = json.loads(event.get('body', '{}'))
        chunk_keys: List[str] = body_data.get('chunkKeys', [])
        file_name: str = body_data.get('fileName', 'file.bin')
        content_type: str = body_data.get('contentType', 'application/octet-stream')
        
        if not chunk_keys:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No chunkKeys provided'})
            }
        
        print(f'[Assemble] Assembling {len(chunk_keys)} chunks for {file_name}')
        
        # Download and assemble chunks from S3
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
        
        # Use S3 CopyObject to assemble chunks efficiently (no memory overhead)
        import uuid
        from datetime import datetime
        
        file_ext = file_name.split('.')[-1] if '.' in file_name else ''
        unique_filename = f"{uuid.uuid4()}.{file_ext}" if file_ext else str(uuid.uuid4())
        final_key = f"uploads/{datetime.now().strftime('%Y/%m/%d')}/{unique_filename}"
        
        print(f'[Assemble] Using S3 multipart copy to {final_key}')
        
        # Create multipart upload
        mpu = s3_client.create_multipart_upload(
            Bucket=bucket_name,
            Key=final_key,
            ContentType=content_type
        )
        
        upload_id = mpu['UploadId']
        parts = []
        
        # Copy each chunk as a part
        for i, chunk_key in enumerate(chunk_keys):
            part_number = i + 1
            print(f'[Assemble] Copying chunk {part_number}/{len(chunk_keys)}: {chunk_key}')
            
            copy_response = s3_client.upload_part_copy(
                Bucket=bucket_name,
                Key=final_key,
                PartNumber=part_number,
                UploadId=upload_id,
                CopySource={'Bucket': bucket_name, 'Key': chunk_key}
            )
            
            parts.append({
                'PartNumber': part_number,
                'ETag': copy_response['CopyPartResult']['ETag']
            })
            
            # Clean up chunk
            s3_client.delete_object(Bucket=bucket_name, Key=chunk_key)
        
        # Complete multipart upload
        s3_client.complete_multipart_upload(
            Bucket=bucket_name,
            Key=final_key,
            UploadId=upload_id,
            MultipartUpload={'Parts': parts}
        )
        
        # Get final file info
        head_response = s3_client.head_object(Bucket=bucket_name, Key=final_key)
        total_size = head_response['ContentLength']
        file_url = f"https://storage.yandexcloud.net/{bucket_name}/{final_key}"
        
        print(f'[Assemble] ✅ Success! Assembled {total_size} bytes ({total_size / 1024 / 1024:.2f}MB) at {file_url}')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                's3Key': final_key,
                'file_size': total_size,
                'file_name': file_name,
                'url': file_url,
                'storage': 's3'
            })
        }
        
    except Exception as e:
        print(f'[Assemble] Error: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': str(e),
                'request_id': context.request_id
            })
        }