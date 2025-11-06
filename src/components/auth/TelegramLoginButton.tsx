import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface TelegramLoginButtonProps {
  onAuth: (userData: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

const BOT_USERNAME = 'fosmmtrtrdev_bot';

export default function TelegramLoginButton({ onAuth }: TelegramLoginButtonProps) {
  const { toast } = useToast();

  useEffect(() => {
    window.onTelegramAuth = async (telegramUser: any) => {
      console.log('🔵 Telegram auth data received:', telegramUser);
      try {
        const response = await fetch(API_ENDPOINTS.TELEGRAM_AUTH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telegramUser),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('🔴 Backend error:', errorData);
          toast({
            title: '❌ Ошибка авторизации',
            description: errorData.error || 'Не удалось войти через Telegram',
            variant: 'destructive',
          });
          return;
        }

        const data = await response.json();
        console.log('✅ Auth successful:', data);
        onAuth(data.user);
      } catch (error) {
        console.error('🔴 Telegram auth error:', error);
        toast({
          title: '❌ Ошибка подключения',
          description: 'Не удалось связаться с сервером',
          variant: 'destructive',
        });
      }
    };

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [onAuth, toast]);

  const handleTelegramLogin = () => {
    const origin = window.location.origin;
    const authUrl = `https://oauth.telegram.org/auth?bot_id=8210986256&origin=${encodeURIComponent(origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(origin)}`;
    
    const width = 550;
    const height = 470;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      authUrl,
      'telegram_auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось открыть окно авторизации. Разрешите всплывающие окна.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleTelegramLogin}
      variant="outline"
      className="w-full h-[46px] bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 transition-all duration-300 group"
    >
      <Icon name="Send" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
      Telegram
    </Button>
  );
}