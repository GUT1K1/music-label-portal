import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface VKLoginButtonProps {
  onAuth: (userData: any) => void;
}

declare global {
  interface Window {
    onVKAuth?: (response: any) => void;
  }
}

export default function VKLoginButton({ onAuth }: VKLoginButtonProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onVKAuth = async (response: any) => {
      console.log('🔵 VK auth response:', response);
      
      if (response.type === 'silent_token' || response.type === 'auth') {
        try {
          const authResponse = await fetch(API_ENDPOINTS.VK_AUTH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: response.token,
              uuid: response.uuid,
              type: response.type
            }),
          });

          console.log('🔵 Backend response status:', authResponse.status);

          if (!authResponse.ok) {
            const errorData = await authResponse.json();
            console.error('🔴 Backend error:', errorData);
            toast({
              title: '❌ Ошибка авторизации',
              description: errorData.error || 'Не удалось войти через VK',
              variant: 'destructive',
            });
            return;
          }

          const data = await authResponse.json();
          console.log('✅ Auth successful:', data);
          onAuth(data.user);
        } catch (error) {
          console.error('🔴 VK auth error:', error);
          toast({
            title: '❌ Ошибка подключения',
            description: 'Не удалось связаться с сервером',
            variant: 'destructive',
          });
        }
      }
    };

    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ VK ID SDK loaded');
        
        const vkidScript = document.createElement('script');
        vkidScript.innerHTML = `
          VKIDSDK.Config.init({
            app: 54299242,
            redirectUrl: 'https://poehali.dev/app',
            state: 'state123',
            scope: 'email phone'
          });

          const oneTap = new VKIDSDK.OneTap();
          
          oneTap.render({
            container: document.getElementById('vk-auth-container'),
            scheme: VKIDSDK.Scheme.LIGHT,
            lang: VKIDSDK.Languages.RUS,
            styles: {
              width: '100%',
              height: 46
            }
          })
          .on(VKIDSDK.WidgetEvents.ERROR, (error) => {
            console.error('VK OneTap error:', error);
          })
          .on(VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
            console.log('VK login success:', payload);
            if (window.onVKAuth) {
              window.onVKAuth(payload);
            }
          });
        `;
        
        document.body.appendChild(vkidScript);
      };
      
      script.onerror = () => {
        console.error('🔴 VK ID SDK failed to load');
        toast({
          title: '❌ Ошибка загрузки',
          description: 'Не удалось загрузить VK ID SDK',
          variant: 'destructive',
        });
      };
      
      containerRef.current.appendChild(script);
    }

    return () => {
      window.onVKAuth = undefined;
    };
  }, [onAuth, toast]);

  return (
    <div className="w-full h-[46px]">
      <div 
        id="vk-auth-container"
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
}