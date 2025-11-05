import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
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

        console.log('🔵 Backend response status:', response.status);

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

    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', 'fosmmtrtrdev_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      script.onerror = () => {
        console.error('🔴 Telegram widget script failed to load');
        toast({
          title: '❌ Ошибка загрузки',
          description: 'Не удалось загрузить виджет Telegram. Проверьте подключение к интернету.',
          variant: 'destructive',
        });
      };
      
      script.onload = () => {
        console.log('✅ Telegram widget loaded successfully');
        // Проверяем наличие ошибок в iframe через небольшую задержку
        setTimeout(() => {
          const iframe = containerRef.current?.querySelector('iframe');
          if (iframe) {
            console.log('✅ Telegram iframe found');
          } else {
            console.warn('⚠️ Telegram iframe not found - возможно бот не настроен');
          }
        }, 1000);
      };
      
      containerRef.current.appendChild(script);
    }

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [onAuth, toast]);

  return (
    <div className="w-full h-[46px]">
      <div 
        ref={containerRef} 
        className="flex justify-center w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:rounded-lg overflow-hidden"
      />
    </div>
  );
}