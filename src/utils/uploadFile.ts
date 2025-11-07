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
    // Маленькие файлы (<10MB) через прямой FormData
    if (file.size < 10 * 1024 * 1024) {
      console.log('[Upload] Using direct FormData upload');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      
      const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`[Upload] ✅ Uploaded: ${result.url}`);
      return result;
    }
    
    // Большие файлы (>10MB) - прямая загрузка в S3 через presigned POST (без Cloud Functions лимитов)
    console.log('[Upload] 🚀 Large file, using direct S3 upload via presigned POST');
    
    const contentType = file.type || 'application/octet-stream';
    
    // Получаем presigned POST от бэкенда
    const response = await fetch(
      `https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка получения presigned POST: ${response.status}`);
    }
    
    const { presignedPost, url: fileUrl, s3Key } = await response.json();
    
    console.log('[Upload] ✅ Got presigned POST, uploading directly to S3...');
    
    // Загружаем файл напрямую в S3 через presigned POST
    const formData = new FormData();
    
    // Добавляем поля из presigned POST (в правильном порядке!)
    Object.keys(presignedPost.fields).forEach(key => {
      formData.append(key, presignedPost.fields[key]);
    });
    
    // Файл должен быть последним
    formData.append('file', file);
    
    const uploadResponse = await fetch(presignedPost.url, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[Upload] S3 upload error:', errorText);
      throw new Error(`Ошибка загрузки в S3: ${uploadResponse.status}`);
    }
    
    console.log('[Upload] ✅ File uploaded to S3:', fileUrl);
    
    return {
      url: fileUrl,
      s3Key,
      fileName: file.name,
      fileSize: file.size,
      storage: 's3' as const
    };
    
  } catch (error) {
    console.error('[Upload] Fetch error:', error instanceof Error ? error.message : 'Unknown', 'for', file.name);
    throw error;
  }
}