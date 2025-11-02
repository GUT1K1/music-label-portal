import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
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
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Глобальная функция для Telegram Widget
    window.onTelegramAuth = async (telegramUser: any) => {
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
          toast({
            title: '❌ Ошибка авторизации',
            description: errorData.error || 'Не удалось войти через Telegram',
            variant: 'destructive',
          });
          return;
        }

        const data = await response.json();
        onAuth(data.user);
      } catch (error) {
        console.error('Telegram auth error:', error);
        toast({
          title: '❌ Ошибка подключения',
          description: 'Не удалось связаться с сервером',
          variant: 'destructive',
        });
      }
    };

    // Загрузка Telegram Widget скрипта
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', 'Music420Label_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      const container = document.getElementById('telegram-login-container');
      if (container) {
        container.appendChild(script);
        scriptLoaded.current = true;
      }
    }

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [onAuth, toast]);

  return (
    <div className="space-y-4">
      <div id="telegram-login-container" className="flex justify-center" />
      
      <div className="text-center">
        <p className="text-xs text-gray-400">
          Войдите через Telegram для быстрого доступа
        </p>
      </div>
    </div>
  );
}