import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

const VK_APP_ID = '54299249';
const VK_REDIRECT_URI = 'https://420.рф/vk-callback.html';

declare global {
  interface Window {
    VKIDSDK: any;
  }
}

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const oneTapRef = useRef<any>(null);

  useEffect(() => {
    const loadVKIDSDK = () => {
      if (window.VKIDSDK) {
        console.log('✅ VK ID SDK already loaded');
        setSdkLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ VK ID SDK loaded');
        setSdkLoaded(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load VK ID SDK');
        toast({
          title: '❌ Ошибка',
          description: 'Не удалось загрузить VK ID SDK',
          variant: 'destructive',
        });
      };
      document.head.appendChild(script);
    };

    loadVKIDSDK();
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !containerRef.current || oneTapRef.current) return;

    try {
      const VKID = window.VKIDSDK;

      // Генерируем state - случайная строка минимум 32 символа
      const generateRandomString = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const state = generateRandomString(32);

      // Инициализируем SDK с callback режимом (без перезагрузки страницы)
      VKID.Config.init({
        app: parseInt(VK_APP_ID),
        redirectUrl: VK_REDIRECT_URI,
        responseMode: VKID.ConfigResponseMode.Callback,
        state: state,
        scope: 'email',
      });

      const oneTap = new VKID.OneTap();
      oneTapRef.current = oneTap;

      oneTap.render({
        container: containerRef.current,
        showAlternativeLogin: true,
      })
      .on(VKID.WidgetEvents.ERROR, (error: any) => {
        console.error('🔴 VK OneTap error:', error);
        toast({
          title: '❌ Ошибка VK',
          description: error.text || 'Ошибка авторизации',
          variant: 'destructive',
        });
      })
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload: any) => {
        console.log('✅ VK login success:', payload);
        setLoading(true);
        
        try {
          const code = payload.code;
          const deviceId = payload.device_id;

          // Обмениваем код на токен на фронтенде
          const authData = await VKID.Auth.exchangeCode(code, deviceId);
          console.log('✅ VK auth data:', authData);
          
          // Отправляем access_token на бэкенд для создания/обновления пользователя
          const response = await fetch(API_ENDPOINTS.VK_AUTH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              access_token: authData.access_token,
              user_id: authData.user_id 
            })
          });
          
          const data = await response.json();
          
          if (data.user) {
            onAuth(data.user);
            toast({
              title: '✅ Успешно',
              description: 'Вход через VK выполнен',
            });
          } else {
            throw new Error(data.error || 'Не удалось авторизоваться');
          }
        } catch (error: any) {
          console.error('🔴 VK auth error:', error);
          toast({
            title: '❌ Ошибка',
            description: error.message || 'Не удалось авторизоваться',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      });

      console.log('✅ VK OneTap widget initialized');
    } catch (error) {
      console.error('🔴 VK OneTap initialization error:', error);
    }
  }, [sdkLoaded, onAuth, toast]);

  return (
    <div className="w-full">
      {!sdkLoaded ? (
        <Button
          disabled
          variant="outline"
          className="w-full h-[46px] bg-[#0077FF] text-white border-[#0077FF]"
        >
          <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          Загрузка VK...
        </Button>
      ) : (
        <div 
          ref={containerRef}
          className="w-full"
          style={{ minHeight: '46px' }}
        />
      )}
      {loading && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          <Icon name="Loader2" className="w-4 h-4 inline animate-spin mr-1" />
          Авторизация...
        </div>
      )}
    </div>
  );
}