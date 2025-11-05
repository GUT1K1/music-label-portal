import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/utils/activityLogger';
import { User, API_URLS } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (username: string, password: string, vkData?: any, telegramData?: any) => {
    try {
      if (telegramData) {
        const userData: User = {
          id: telegramData.id,
          username: telegramData.username,
          full_name: telegramData.full_name,
          fullName: telegramData.full_name,
          role: telegramData.role as 'artist' | 'manager' | 'director',
          telegram_chat_id: telegramData.telegram_chat_id,
          avatar: telegramData.avatar,
          vk_photo: telegramData.avatar, // Синхронизируем avatar и vk_photo
          is_blocked: telegramData.is_blocked,
          is_frozen: telegramData.is_frozen
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        logActivity(userData.id, 'login', `Пользователь ${userData.full_name} вошёл через Telegram`);
        toast({ title: '✅ Вход выполнен', description: `Добро пожаловать, ${userData.full_name}` });
        return;
      }

      if (!password && !vkData) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
        return;
      }

      const requestBody: any = { username, password };
      if (vkData) {
        requestBody.vk_data = vkData;
      }

      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Синхронизируем vk_photo и avatar при входе
        const userData = data.user;
        if (userData.vk_photo) {
          userData.avatar = userData.vk_photo;
        }
        if (userData.avatar) {
          userData.vk_photo = userData.avatar;
        }
        if (userData.full_name) {
          userData.fullName = userData.full_name;
        }
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        logActivity(userData.id, 'login', `Пользователь ${userData.full_name} вошёл в систему`);
        toast({ title: '✅ Вход выполнен', description: `Добро пожаловать, ${userData.full_name}` });
      } else {
        toast({ title: '❌ Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '❌ Ошибка подключения', variant: 'destructive' });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: 'Вы вышли из системы' });
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      
      // Синхронизируем camelCase и snake_case поля
      if (updates.fullName) {
        updatedUser.full_name = updates.fullName;
      }
      if (updates.full_name) {
        updatedUser.fullName = updates.full_name;
      }
      
      // КРИТИЧНО: синхронизируем avatar и vk_photo в обе стороны
      if (updates.avatar) {
        updatedUser.vk_photo = updates.avatar;
        updatedUser.avatar = updates.avatar;
      }
      if (updates.vk_photo) {
        updatedUser.avatar = updates.vk_photo;
        updatedUser.vk_photo = updates.vk_photo;
      }
      
      if (updates.email) {
        updatedUser.email = updates.email;
      }
      
      if (updates.balance !== undefined) {
        updatedUser.balance = updates.balance;
      }
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Логируем для отладки
      console.log('User profile updated:', { 
        avatar: updatedUser.avatar, 
        vk_photo: updatedUser.vk_photo,
        fullName: updatedUser.fullName 
      });
    }
  };

  const refreshUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URLS.users}?id=${user.id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const updatedUser = await response.json();
      
      if (updatedUser && updatedUser.id) {
        // Синхронизируем vk_photo и avatar
        if (updatedUser.vk_photo) {
          updatedUser.avatar = updatedUser.vk_photo;
        }
        if (updatedUser.avatar) {
          updatedUser.vk_photo = updatedUser.avatar;
        }
        
        // Синхронизируем full_name и fullName
        if (updatedUser.full_name) {
          updatedUser.fullName = updatedUser.full_name;
        }
        if (updatedUser.fullName) {
          updatedUser.full_name = updatedUser.fullName;
        }
        
        const hasChanges = 
          updatedUser.role !== user.role || 
          updatedUser.balance !== user.balance ||
          updatedUser.vk_photo !== user.vk_photo ||
          updatedUser.full_name !== user.full_name;
        
        if (hasChanges) {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          console.log('User data refreshed from server:', {
            avatar: updatedUser.avatar,
            vk_photo: updatedUser.vk_photo,
            fullName: updatedUser.fullName
          });
          
          if (updatedUser.role !== user.role) {
            toast({ title: '✅ Данные обновлены', description: 'Ваши права доступа изменены' });
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [user, toast]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Синхронизируем поля при загрузке из localStorage
      if (userData.vk_photo && !userData.avatar) {
        userData.avatar = userData.vk_photo;
      }
      if (userData.avatar && !userData.vk_photo) {
        userData.vk_photo = userData.avatar;
      }
      if (userData.full_name && !userData.fullName) {
        userData.fullName = userData.full_name;
      }
      if (userData.fullName && !userData.full_name) {
        userData.full_name = userData.fullName;
      }
      
      setUser(userData);
      // Пересохраняем с синхронизированными полями
      localStorage.setItem('user', JSON.stringify(userData));
      
      // КРИТИЧНО: Сразу после загрузки из localStorage обновляем данные с сервера
      // чтобы получить актуальную аватарку
      setTimeout(() => {
        fetch(`${API_URLS.users}?id=${userData.id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Id': userData.id.toString()
          }
        })
        .then(res => res.json())
        .then(serverUser => {
          if (serverUser && serverUser.id) {
            // Синхронизируем avatar и vk_photo
            if (serverUser.vk_photo) {
              serverUser.avatar = serverUser.vk_photo;
            }
            if (serverUser.avatar) {
              serverUser.vk_photo = serverUser.avatar;
            }
            if (serverUser.full_name) {
              serverUser.fullName = serverUser.full_name;
            }
            
            setUser(serverUser);
            localStorage.setItem('user', JSON.stringify(serverUser));
            
            console.log('✅ Avatar loaded from server:', {
              avatar: serverUser.avatar,
              vk_photo: serverUser.vk_photo
            });
          }
        })
        .catch(err => console.error('Failed to refresh user on mount:', err));
      }, 100);
    }
  }, []); // Пустой массив - запускается только один раз при монтировании

  useEffect(() => {
    if (!user) return;
    
    // Оптимизация: обновляем данные пользователя раз в 10 минут вместо 5
    const interval = setInterval(() => {
      if (!document.hidden) {
        refreshUserData();
      }
    }, 600000);
    
    // Listen for role changes from other tabs or admin actions
    const handleRoleChange = (event: CustomEvent) => {
      if (event.detail.userId === user.id) {
        refreshUserData();
      }
    };
    
    window.addEventListener('user-role-changed', handleRoleChange as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('user-role-changed', handleRoleChange as EventListener);
    };
  }, [user?.id, refreshUserData]);

  return { user, login, logout, updateUserProfile, refreshUserData };
};