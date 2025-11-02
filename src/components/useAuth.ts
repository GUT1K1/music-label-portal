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
          role: telegramData.role as 'artist' | 'manager' | 'director',
          telegram_chat_id: telegramData.telegram_chat_id,
          avatar: telegramData.avatar,
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
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        logActivity(data.user.id, 'login', `Пользователь ${data.user.full_name} вошёл в систему`);
        toast({ title: '✅ Вход выполнен', description: `Добро пожаловать, ${data.user.full_name}` });
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
      if (updates.avatar) {
        updatedUser.vk_photo = updates.avatar;
      }
      if (updates.vk_photo) {
        updatedUser.avatar = updates.vk_photo;
      }
      if (updates.balance !== undefined) {
        updatedUser.balance = updates.balance;
      }
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
        const hasChanges = 
          updatedUser.role !== user.role || 
          updatedUser.balance !== user.balance ||
          updatedUser.avatar !== user.avatar ||
          updatedUser.full_name !== user.full_name;
        
        if (hasChanges) {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
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
      setUser(userData);
    }
  }, []); // Пустой массив - запускается только один раз при монтировании

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      if (!document.hidden) {
        refreshUserData();
      }
    }, 300000);
    
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