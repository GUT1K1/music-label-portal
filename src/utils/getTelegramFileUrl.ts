import { API_ENDPOINTS } from '@/config/api';

/**
 * Получает реальный URL для воспроизведения из Telegram file_id
 * @param url - URL вида "telegram://file_id" или обычный HTTP URL
 * @returns Реальный HTTP URL для воспроизведения
 */
export async function getTelegramFileUrl(url: string): Promise<string> {
  // Если это обычный HTTP/HTTPS URL - возвращаем как есть
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Если это Telegram URL - получаем реальный URL
  if (url.startsWith('telegram://')) {
    const fileId = url.replace('telegram://', '');
    
    try {
      const response = await fetch(
        `${API_ENDPOINTS.TELEGRAM_GET_FILE}?file_id=${encodeURIComponent(fileId)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to get Telegram file URL: ${response.status}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('[getTelegramFileUrl] Error:', error);
      throw error;
    }
  }
  
  // Неизвестный формат - возвращаем как есть
  return url;
}
