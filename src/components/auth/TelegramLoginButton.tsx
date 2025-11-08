import { useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface TelegramLoginButtonProps {
  onAuth: (userData: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

const BOT_USERNAME = 'rf420smm_bot';

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

  return (
    <div 
      ref={containerRef}
      className="telegram-widget-wrapper w-full"
      style={{
        '--tg-border-color': 'rgb(234 179 8 / 0.3)',
        '--tg-bg-color': 'transparent',
        '--tg-hover-border': 'rgb(234 179 8 / 0.5)',
        '--tg-hover-bg': 'rgb(234 179 8 / 0.1)',
      } as any}
    />
  );
}