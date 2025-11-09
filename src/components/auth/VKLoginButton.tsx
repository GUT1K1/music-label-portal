import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

const VK_APP_ID = '54299249';
const VK_REDIRECT_PROXY = 'https://functions.poehali.dev/c2662a32-9a12-4f7d-b516-8441bc06cfa5';

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();

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
    try {
      // Генерируем PKCE параметры
      const codeVerifier = generateRandomString(64);
      const stateRandom = generateRandomString(32);
      
      // Передаем домен + code_verifier в state
      // Формат: random__base64url(domain)__base64url(code_verifier)
      // Используем __ вместо | т.к. VK может обрезать | в state
      const currentDomain = window.location.origin;
      
      // URL-safe base64 без паддинга (короче)
      const domainB64 = btoa(currentDomain).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const verifierB64 = btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      const state = `${stateRandom}__${domainB64}__${verifierB64}`;
      
      console.log('🔵 State:', state);
      console.log('🔵 State length:', state.length, 'chars');
      
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64urlencode(hashed);
      
      // Формируем URL авторизации
      // VK ID редиректит на прокси-функцию, которая потом редиректит на фронтенд
      const redirectUri = VK_REDIRECT_PROXY;
      
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
      console.log('🔵 Redirecting to VK auth:', authUrl);
      
      // Делаем редирект на VK (не popup!)
      window.location.href = authUrl;
      
    } catch (error: any) {
      console.error('🔴 VK auth error:', error);
      toast({
        title: '❌ Ошибка',
        description: error.message || 'Не удалось авторизоваться',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleVKLogin}
      variant="outline"
      className="w-full h-[46px] bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 transition-all duration-300 group"
    >
      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.365-2.108-.336-3.830.021-1.281.1-2.197-.769-2.197h-3.055c-.391 0-.614.166-.614.487 0 .549.711.974.711 1.916v4.44c0 .522-.167.848-.336.848-.337 0-1.189-.73-2.614-3.961-.408-.913-.489-1.084-1.296-1.084H4.754c-.663 0-.854.347-.854.667 0 .547.842 4.267 2.615 7.019 1.18 1.837 2.888 2.519 4.1 2.519.609 0 .716-.329.716-.716v-1.269c0-.403.084-.571.368-.571.208 0 .716.108 1.77 1.146 1.209 1.186 1.502 1.685 2.216 1.685z"/>
      </svg>
      VK ID
    </Button>
  );
}