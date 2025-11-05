import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

const VK_APP_ID = '54299244';
const VK_REDIRECT_URI = 'https://420.рф/vk-callback.html';

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleVKLogin = () => {
    setLoading(true);
    
    const width = 650;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const authUrl = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=popup&redirect_uri=${encodeURIComponent(VK_REDIRECT_URI)}&scope=email&response_type=token&v=5.131`;
    
    const popup = window.open(
      authUrl,
      'VK Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    const checkPopup = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setLoading(false);
          return;
        }
        
        if (popup.location.href.includes(VK_REDIRECT_URI)) {
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const userId = params.get('user_id');
          
          if (accessToken && userId) {
            popup.close();
            clearInterval(checkPopup);
            
            fetch('https://api.vk.com/method/users.get', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `user_ids=${userId}&fields=photo_200&access_token=${accessToken}&v=5.131`
            })
            .then(res => res.json())
            .then(data => {
              if (data.response && data.response[0]) {
                const vkUser = data.response[0];
                const userData = {
                  id: vkUser.id,
                  username: `vk_${vkUser.id}`,
                  full_name: `${vkUser.first_name} ${vkUser.last_name}`,
                  fullName: `${vkUser.first_name} ${vkUser.last_name}`,
                  role: 'artist' as const,
                  vk_id: String(vkUser.id),
                  avatar: vkUser.photo_200,
                  vk_photo: vkUser.photo_200,
                  is_blocked: false,
                  is_frozen: false
                };
                
                onAuth(userData);
                setLoading(false);
              } else {
                toast({
                  title: '❌ Ошибка',
                  description: 'Не удалось получить данные пользователя',
                  variant: 'destructive',
                });
                setLoading(false);
              }
            })
            .catch(error => {
              console.error('VK API error:', error);
              toast({
                title: '❌ Ошибка',
                description: 'Не удалось получить данные из VK',
                variant: 'destructive',
              });
              setLoading(false);
            });
          }
        }
      } catch (e) {
        // Cross-origin error - ignore
      }
    }, 500);
    
    setTimeout(() => {
      clearInterval(checkPopup);
      if (popup && !popup.closed) {
        popup.close();
      }
      setLoading(false);
    }, 60000);
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