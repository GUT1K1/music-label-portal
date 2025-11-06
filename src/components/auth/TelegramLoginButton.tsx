import { useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface TelegramLoginButtonProps {
  onAuth: (userData: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
    Telegram?: any;
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

    if (containerRef.current && !window.Telegram) {
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
    <div className="relative w-full h-[46px] overflow-hidden rounded-md border border-yellow-500/30 hover:border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300">
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center [&_iframe]:!opacity-0 [&_iframe]:!pointer-events-none"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg className="w-5 h-5 mr-2 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.562-1.362 6.05-.168.631-.5.843-.822.863-.7.065-1.232-.462-1.912-.906-1.063-.693-1.662-1.124-2.693-1.8-1.192-.782-.42-1.213.262-1.916.179-.184 3.293-3.02 3.355-3.275.008-.032.016-.15-.056-.213-.072-.062-.177-.041-.253-.024-.108.024-1.83 1.162-5.165 3.414-.489.336-.932.5-1.33.492-.438-.009-1.28-.248-1.906-.452-.767-.25-1.376-.382-1.323-.806.028-.22.334-.446.918-.677 3.596-1.566 5.993-2.6 7.191-3.1 3.419-1.43 4.13-1.678 4.593-1.686.102-.002.33.024.478.144.125.102.16.239.176.335.017.096.038.315.022.486z"/>
        </svg>
        <span className="text-yellow-400 font-medium">Telegram</span>
      </div>
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => {
          const iframe = containerRef.current?.querySelector('iframe');
          if (iframe) {
            const button = iframe.contentWindow?.document.querySelector('button');
            button?.click();
          }
        }}
      />
    </div>
  );
}