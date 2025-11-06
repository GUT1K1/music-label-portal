export interface UploadFileResult {
  url: string;
  fileName: string;
  fileSize: number;
  s3Key?: string;
  file_id?: string;
  storage?: 'telegram' | 's3';
}

/**
 * Загрузка файла: маленькие через FormData, большие через presigned S3 URL
 */
export async function uploadFile(file: File): Promise<UploadFileResult> {
  const maxSize = 100 * 1024 * 1024;
  const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
  
  console.log(`[Upload] File: ${file.name}, Size: ${fileSizeMB}MB`);
  
  if (file.size > maxSize) {
    throw new Error(`Размер файла превышает 100MB (текущий: ${fileSizeMB}MB)`);
  }
  
  try {
    // Маленькие файлы (<10MB) через FormData
    if (file.size < 10 * 1024 * 1024) {
      console.log('[Upload] Using FormData for small file');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      
      console.log('[Upload] Sending FormData request...');
      const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        body: formData
      });
      
      console.log('[Upload] Response received:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[Upload] HTTP Error', response.status, ':', errorText);
        throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`[Upload] Success! File uploaded to: ${result.url}`);
      return result;
    }
    
    // Большие файлы (>10MB) - presigned URL для прямой загрузки в S3
    console.log('[Upload] 📦 Large file detected, using presigned URL');
    
    const contentType = file.type || 'application/octet-stream';
    
    // 1. Получаем presigned URL от бэкенда
    console.log('[Upload] Requesting presigned URL...');
    const presignedResponse = await fetch(
      `https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`,
      { method: 'GET' }
    );
    
    if (!presignedResponse.ok) {
      throw new Error(`Не удалось получить presigned URL: ${presignedResponse.status}`);
    }
    
    const { presignedUrl, url, s3Key } = await presignedResponse.json();
    console.log('[Upload] Presigned URL received, uploading to S3...');
    
    // 2. Загружаем файл напрямую в S3 через presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType
      }
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Ошибка загрузки в S3: ${uploadResponse.status}`);
    }
    
    console.log('[Upload] ✅ File uploaded successfully to S3:', url);
    
    return {
      url,
      s3Key,
      fileName: file.name,
      fileSize: file.size
    };
    
  } catch (error) {
    console.error('[Upload] Fetch error:', error instanceof Error ? error.message : 'Unknown', 'for', file.name);
    throw error;
  }
}