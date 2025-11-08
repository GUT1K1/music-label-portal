import { useEffect, useRef, useState } from 'react';
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

const BOT_USERNAME = 'rf420smm_bot';
const TELEGRAM_AUTH_URL = `https://oauth.telegram.org/auth?bot_id=7845263802&origin=${encodeURIComponent(window.location.origin)}&request_access=write&return_to=${encodeURIComponent(window.location.origin)}`;

export default function TelegramLoginButton({ onAuth }: TelegramLoginButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.onTelegramAuth = async (telegramUser: any) => {
      console.log('🔵 Telegram auth data received:', telegramUser);
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [onAuth, toast]);

  const handleTelegramLogin = () => {
    const width = 550;
    const height = 470;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      TELEGRAM_AUTH_URL,
      'telegram-login',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <Button
      onClick={handleTelegramLogin}
      disabled={loading}
      variant="outline"
      className="w-full h-[46px] bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 transition-all duration-300 group"
    >
      {loading ? (
        <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/>
        </svg>
      )}
      Telegram
    </Button>
  );
}