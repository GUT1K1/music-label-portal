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
    
    // Большие файлы (>10MB) - загружаем через Telegram Bot API
    console.log('[Upload] 🚀 Large file, uploading via Telegram (supports up to 2GB)');
    
    const contentType = file.type || 'application/octet-stream';
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    console.log(`[Upload] Step 1/2: Uploading ${totalChunks} chunks to S3...`);
    
    const chunkKeys: string[] = [];
    
    // Шаг 1: Загружаем chunks в S3 (это работает, т.к. <3MB)
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`[Upload] 📤 Chunk ${i + 1}/${totalChunks}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`);
      
      const base64Chunk = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(chunk);
      });
      
      const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Chunk,
          fileName: `${file.name}.chunk${i}`,
          contentType: 'application/octet-stream'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки chunk ${i + 1}: ${response.status}`);
      }
      
      const result = await response.json();
      chunkKeys.push(result.s3Key);
    }
    
    console.log('[Upload] ✅ All chunks uploaded to S3');
    console.log('[Upload] Step 2/2: Assembling chunks in S3...');
    
    // Шаг 2: Вызываем бэкенд для сборки chunks в один файл (через S3 multipart copy, без памяти)
    const assembleResponse = await fetch('https://functions.poehali.dev/086992a2-98d4-4646-9483-14be7b0c5208', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chunkKeys,
        fileName: file.name,
        contentType
      })
    });
    
    if (!assembleResponse.ok) {
      throw new Error(`Ошибка сборки файла: ${assembleResponse.status}`);
    }
    
    const result = await assembleResponse.json();
    
    console.log('[Upload] ✅ File assembled in S3:', result.url);
    
    return {
      url: result.url,
      s3Key: result.s3Key,
      fileName: file.name,
      fileSize: result.file_size,
      storage: 's3' as const
    };
    
  } catch (error) {
    console.error('[Upload] Fetch error:', error instanceof Error ? error.message : 'Unknown', 'for', file.name);
    throw error;
  }
}