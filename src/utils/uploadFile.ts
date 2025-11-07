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
    
    // Большие файлы (>10MB) - S3 multipart upload через бэкенд
    console.log('[Upload] 🚀 Large file, using S3 multipart upload');
    
    const contentType = file.type || 'application/octet-stream';
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks (минимум для S3 multipart)
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    console.log(`[Upload] Splitting into ${totalChunks} chunks (5MB each)`);
    
    let uploadId = '';
    let s3Key = '';
    let finalUrl = '';
    
    // Шаг 1: Инициализация multipart upload
    const initResponse = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'init-multipart',
        fileName: file.name,
        contentType
      })
    });
    
    if (!initResponse.ok) {
      throw new Error(`Ошибка инициализации: ${initResponse.status}`);
    }
    
    const initData = await initResponse.json();
    uploadId = initData.uploadId;
    s3Key = initData.s3Key;
    finalUrl = initData.url;
    
    console.log('[Upload] ✅ Multipart upload initialized:', uploadId);
    
    // Шаг 2: Загружаем части
    const parts: { PartNumber: number; ETag: string }[] = [];
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`[Upload] 📤 Part ${i + 1}/${totalChunks}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Отправляем часть через FormData (бинарные данные, не base64)
      const formData = new FormData();
      formData.append('action', 'upload-part');
      formData.append('uploadId', uploadId);
      formData.append('s3Key', s3Key);
      formData.append('partNumber', (i + 1).toString());
      formData.append('part', chunk, 'part.bin');
      
      const uploadPartResponse = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadPartResponse.ok) {
        throw new Error(`Ошибка загрузки части ${i + 1}: ${uploadPartResponse.status}`);
      }
      
      const partData = await uploadPartResponse.json();
      parts.push({ PartNumber: i + 1, ETag: partData.ETag });
    }
    
    console.log('[Upload] ✅ All parts uploaded, completing...');
    
    // Шаг 3: Завершение multipart upload
    const completeResponse = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete-multipart',
        uploadId,
        s3Key,
        parts
      })
    });
    
    if (!completeResponse.ok) {
      throw new Error(`Ошибка завершения: ${completeResponse.status}`);
    }
    
    console.log('[Upload] ✅ File uploaded to S3:', finalUrl);
    
    return {
      url: finalUrl,
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