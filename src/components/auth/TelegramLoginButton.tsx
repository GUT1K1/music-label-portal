import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', BOT_USERNAME);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      containerRef.current.appendChild(script);
    }

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [onAuth, toast]);

  const handleClick = () => {
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      iframe.click();
    }
  };

  return (
    <div className="relative w-full h-[46px]">
      <div 
        ref={containerRef}
        className="absolute inset-0 opacity-0 pointer-events-auto"
      />
      <Button
        onClick={handleClick}
        variant="outline"
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 transition-all duration-300 group pointer-events-none"
      >
        <Icon name="Send" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        Telegram
      </Button>
    </div>
  );
}