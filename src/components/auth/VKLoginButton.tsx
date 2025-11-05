import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      setLoading(true);
      
      fetch(`${API_ENDPOINTS.VK_AUTH}?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            onAuth(data.user);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            toast({
              title: '❌ Ошибка авторизации',
              description: 'Не удалось получить данные пользователя',
              variant: 'destructive',
            });
          }
        })
        .catch(error => {
          console.error('VK auth error:', error);
          toast({
            title: '❌ Ошибка подключения',
            description: 'Не удалось связаться с сервером',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [onAuth, toast]);

  const handleVKLogin = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.VK_AUTH);
      const data = await response.json();
      
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        toast({
          title: '❌ Ошибка',
          description: 'Не удалось получить ссылку авторизации',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('VK auth error:', error);
      toast({
        title: '❌ Ошибка подключения',
        description: 'Не удалось связаться с сервером',
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