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
    
    // Большие файлы (>10MB) - загружаем через бэкенд с base64, но кусками по 8MB
    console.log('[Upload] 🚀 Large file, uploading in chunks via backend');
    
    const contentType = file.type || 'application/octet-stream';
    const chunkSize = 8 * 1024 * 1024; // 8MB per chunk (raw file size)
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    console.log(`[Upload] Splitting into ${totalChunks} chunks (8MB raw each)`);
    
    let s3Key = '';
    let finalUrl = '';
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      console.log(`[Upload] 📤 Chunk ${i + 1}/${totalChunks}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Читаем chunk как base64
      const base64Chunk = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(chunk);
      });
      
      // Отправляем chunk через JSON
      const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Chunk,
          fileName: file.name,
          contentType,
          chunkIndex: i,
          totalChunks,
          s3Key: i > 0 ? s3Key : undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки chunk ${i + 1}: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (i === 0) {
        s3Key = result.s3Key;
      }
      
      if (i === totalChunks - 1) {
        finalUrl = result.url;
        console.log('[Upload] ✅ File uploaded to S3:', finalUrl);
      }
    }
    
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