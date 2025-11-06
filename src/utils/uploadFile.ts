export interface UploadFileResult {
  url: string;
  fileName: string;
  fileSize: number;
  s3Key?: string;
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
    
    // Большие файлы (>10MB) - используем presigned URL для прямой загрузки в S3
    console.log('[Upload] 🚀 Large file detected, using direct S3 upload via presigned URL');
    
    const contentType = file.type || 'application/octet-stream';
    
    // Получаем presigned URL
    const presignedResponse = await fetch(
      `https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`,
      { method: 'GET' }
    );
    
    if (!presignedResponse.ok) {
      throw new Error('Не удалось получить ссылку для загрузки');
    }
    
    const { presignedUrl, url, s3Key } = await presignedResponse.json();
    console.log('[Upload] Got presigned URL, uploading directly to S3...');
    
    // Загружаем файл напрямую в S3 с повторными попытками
    let uploadResponse;
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Upload] Attempt ${attempt}/${maxRetries}: Uploading to S3...`);
        
        uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': contentType
          },
          mode: 'cors'
        });
        
        if (uploadResponse.ok) {
          console.log('[Upload] ✅ File uploaded successfully to S3:', url);
          break;
        } else {
          lastError = new Error(`S3 returned ${uploadResponse.status}: ${uploadResponse.statusText}`);
          console.error(`[Upload] Attempt ${attempt} failed:`, lastError.message);
        }
      } catch (error) {
        lastError = error;
        console.error(`[Upload] Attempt ${attempt} failed with exception:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!uploadResponse || !uploadResponse.ok) {
      throw new Error(`Не удалось загрузить файл после ${maxRetries} попыток: ${lastError?.message || 'Unknown error'}`);
    }
    
    return {
      url,
      s3Key,
      fileName: file.name,
      fileSize: file.size
    };
    
    /* СТАРАЯ ЛОГИКА ЧАНКОВ - ЗАКОММЕНТИРОВАНА
    // Большие файлы (>10MB) - разбиваем на chunks по 2MB
    console.log('[Upload] 📦 Large file detected, using chunked upload');
    
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log(`[Upload] Splitting into ${totalChunks} chunks of ~2MB each`);
    
    const contentType = file.type || 'application/octet-stream';
    let s3Key = '';
    let finalUrl = '';
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`[Upload] 📤 Chunk ${i + 1}/${totalChunks}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Retry логика: 3 попытки на каждый чанк
      let retries = 3;
      let uploaded = false;
      
      while (retries > 0 && !uploaded) {
        try {
          // Convert chunk to base64
          const reader = new FileReader();
          const chunkBase64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(chunk);
          });
          
          // Send chunk to backend с таймаутом 120 секунд
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 120000);
          
          const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: chunkBase64,
              fileName: file.name,
              contentType,
              chunkIndex: i,
              totalChunks,
              s3Key: i > 0 ? s3Key : undefined
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeout);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const result = await response.json();
          
          if (i === 0) {
            s3Key = result.s3Key;
          }
          
          if (i === totalChunks - 1) {
            finalUrl = result.url;
            console.log('[Upload] ✅ All chunks uploaded successfully:', finalUrl);
          }
          
          uploaded = true;
        } catch (error) {
          retries--;
          console.warn(`[Upload] Chunk ${i + 1} failed, retries left: ${retries}`, error);
          
          if (retries === 0) {
            throw new Error(`Чанк ${i + 1}/${totalChunks} не удалось загрузить после 3 попыток`);
          }
          
          // Пауза перед повтором: 1 сек
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
    */
    
  } catch (error) {
    console.error('[Upload] Fetch error:', error instanceof Error ? error.message : 'Unknown', 'for', file.name);
    throw error;
  }
}