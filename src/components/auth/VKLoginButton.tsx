import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

const VK_APP_ID = '54299249';
const VK_REDIRECT_URI = encodeURIComponent('https://420.рф/vk-callback.html');

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Генерация случайной строки для state и code_verifier
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // SHA-256 хеширование и base64url кодирование для PKCE
  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hash;
  };

  const base64urlencode = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const byte of bytes) {
      str += String.fromCharCode(byte);
    }
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const handleVKLogin = async () => {
    setLoading(true);
    
    try {
      // Генерируем PKCE параметры
      const codeVerifier = generateRandomString(64);
      const state = generateRandomString(32);
      
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64urlencode(hashed);
      
      // Сохраняем в sessionStorage для использования после редиректа
      sessionStorage.setItem('vk_code_verifier', codeVerifier);
      sessionStorage.setItem('vk_state', state);
      
      // Формируем URL авторизации
      const redirectUri = 'https://420.рф/vk-callback.html';
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: VK_APP_ID,
        redirect_uri: redirectUri,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: 'email phone',
      });
      
      const authUrl = `https://id.vk.ru/authorize?${params.toString()}`;
      console.log('🔵 Opening VK auth:', authUrl);
      
      // Открываем popup
      const width = 650;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const popup = window.open(
        authUrl,
        'VK Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup) {
        throw new Error('Не удалось открыть окно авторизации');
      }
      
      // Слушаем сообщения от callback страницы
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        const { code, state: returnedState, device_id } = event.data;
        
        if (!code) return;
        
        console.log('🔵 Got VK code from callback:', code);
        
        // Проверяем state
        const savedState = sessionStorage.getItem('vk_state');
        if (returnedState !== savedState) {
          throw new Error('State mismatch - possible CSRF attack');
        }
        
        // Обмениваем код на токен через наш backend
        const savedCodeVerifier = sessionStorage.getItem('vk_code_verifier');
        
        const response = await fetch(API_ENDPOINTS.VK_AUTH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier: savedCodeVerifier,
            device_id,
            redirect_uri: 'https://420.рф/vk-callback.html'
          })
        });
        
        const data = await response.json();
        
        if (data.user) {
          onAuth(data.user);
          toast({
            title: '✅ Успешно',
            description: 'Вход через VK выполнен',
          });
          
          // Очищаем sessionStorage
          sessionStorage.removeItem('vk_code_verifier');
          sessionStorage.removeItem('vk_state');
        } else {
          throw new Error(data.error || 'Не удалось авторизоваться');
        }
        
        window.removeEventListener('message', messageHandler);
        setLoading(false);
      };
      
      window.addEventListener('message', messageHandler);
      
      // Таймаут на 2 минуты
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        if (popup && !popup.closed) {
          popup.close();
        }
        setLoading(false);
      }, 120000);
      
    } catch (error: any) {
      console.error('🔴 VK auth error:', error);
      toast({
        title: '❌ Ошибка',
        description: error.message || 'Не удалось авторизоваться',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleVKLogin}
      disabled={loading}
      variant="outline"
      className="w-full h-[46px] bg-[#0077FF] hover:bg-[#0066DD] text-white border-[#0077FF] hover:border-[#0066DD]"
    >
      {loading ? (
        <>
          <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          Подключение...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.365-2.108-.336-3.830.021-1.281.1-2.197-.769-2.197h-3.055c-.391 0-.614.166-.614.487 0 .549.711.974.711 1.916v4.44c0 .522-.167.848-.336.848-.337 0-1.189-.73-2.614-3.961-.408-.913-.489-1.084-1.296-1.084H4.754c-.663 0-.854.347-.854.667 0 .547.842 4.267 2.615 7.019 1.18 1.837 2.888 2.519 4.1 2.519.609 0 .716-.329.716-.716v-1.269c0-.403.084-.571.368-.571.208 0 .716.108 1.77 1.146 1.209 1.186 1.502 1.685 2.216 1.685z"/>
          </svg>
          Войти через VK
        </>
      )}
    </Button>
  );
}