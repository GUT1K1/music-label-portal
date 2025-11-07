export interface UploadFileResult {
  url: string;
  fileName: string;
  fileSize: number;
  s3Key?: string;
  file_id?: string;
  storage?: 'telegram' | 's3';
}

export type UploadProgressCallback = (progress: number) => void;

/**
 * Загрузка файла: маленькие через FormData, большие через chunked upload
 */
export async function uploadFile(file: File, onProgress?: UploadProgressCallback): Promise<UploadFileResult> {
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
      onProgress?.(30);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      
      onProgress?.(50);
      
      const response = await fetch('https://functions.poehali.dev/01922e7e-40ee-4482-9a75-1bf53b8812d9', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      onProgress?.(90);
      const result = await response.json();
      onProgress?.(100);
      
      console.log(`[Upload] ✅ Uploaded: ${result.url}`);
      return result;
    }
    
    // Большие файлы (>10MB) - chunked upload (бэкенд собирает из temp chunks)
    console.log('[Upload] 🚀 Large file, using chunked upload');
    
    const contentType = file.type || 'application/octet-stream';
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    console.log(`[Upload] Uploading ${totalChunks} chunks...`);
    
    let s3Key = '';
    let finalUrl = '';
    
    // Загружаем chunks последовательно (бэкенд сохраняет в temp и собирает в конце)
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      // Прогресс: от 0 до 95% (оставляем 5% на финализацию)
      const progress = Math.floor((i / totalChunks) * 95);
      onProgress?.(progress);
      
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
      
      // Последний chunk - бэкенд вернёт финальный URL
      if (i === totalChunks - 1) {
        finalUrl = result.url;
        onProgress?.(100);
        console.log('[Upload] ✅ File uploaded:', finalUrl);
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