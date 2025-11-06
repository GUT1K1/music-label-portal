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
    // Маленькие файлы (<50MB) через прямой FormData
    if (file.size < 50 * 1024 * 1024) {
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
    
    // Большие файлы (>50MB) - chunked upload через multipart
    console.log('[Upload] 📦 Large file, using chunked upload');
    
    const chunkSize = 40 * 1024 * 1024; // 40MB chunks (безопасно под лимит 60MB)
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log(`[Upload] Splitting into ${totalChunks} chunks`);
    
    const contentType = file.type || 'application/octet-stream';
    let s3Key = '';
    let finalUrl = '';
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`[Upload] 📤 Chunk ${i + 1}/${totalChunks}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Retry логика
      let retries = 3;
      let uploaded = false;
      
      while (retries > 0 && !uploaded) {
        try {
          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('fileName', file.name);
          formData.append('contentType', contentType);
          formData.append('chunkIndex', i.toString());
          formData.append('totalChunks', totalChunks.toString());
          if (i > 0) formData.append('s3Key', s3Key);
          
          const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const result = await response.json();
          
          if (i === 0) {
            s3Key = result.s3Key;
          }
          
          if (i === totalChunks - 1) {
            finalUrl = result.url;
            console.log('[Upload] ✅ Complete:', finalUrl);
          }
          
          uploaded = true;
        } catch (error) {
          retries--;
          console.warn(`[Upload] Chunk ${i + 1} failed, retries: ${retries}`);
          
          if (retries === 0) {
            throw new Error(`Чанк ${i + 1}/${totalChunks} не загрузился`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    return {
      url: finalUrl,
      s3Key,
      fileName: file.name,
      fileSize: file.size
    };
    
  } catch (error) {
    console.error('[Upload] Fetch error:', error instanceof Error ? error.message : 'Unknown', 'for', file.name);
    throw error;
  }
}