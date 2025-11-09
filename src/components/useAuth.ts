import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/utils/activityLogger';
import { User, API_URLS } from '@/types';
import { cookies } from '@/utils/cookies';
import { normalizeUser } from '@/utils/userHelpers';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (username: string, password: string, vkData?: any, telegramData?: any) => {
    try {
      if (telegramData) {
        const userData = normalizeUser(telegramData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        cookies.set('user_id', userData.id.toString(), 30);
        cookies.set('user_session', btoa(JSON.stringify({ id: userData.id, role: userData.role })), 30);
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
        const userData = normalizeUser(data.user);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        cookies.set('user_id', userData.id.toString(), 30);
        cookies.set('user_session', btoa(JSON.stringify({ id: userData.id, role: userData.role })), 30);
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
    cookies.remove('user_id');
    cookies.remove('user_session');
    toast({ title: 'Вы вышли из системы' });
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = normalizeUser({ ...user, ...updates });
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
      
      const serverData = await response.json();
      
      if (serverData && serverData.id) {
        const updatedUser = normalizeUser(serverData);
        
        const hasChanges = 
          updatedUser.role !== user.role || 
          updatedUser.balance !== user.balance ||
          updatedUser.avatar !== user.avatar ||
          updatedUser.fullName !== user.fullName;
        
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
    const cookieSession = cookies.get('user_session');
    const savedUser = localStorage.getItem('user');
    
    if (cookieSession && !savedUser) {
      try {
        const sessionData = JSON.parse(atob(cookieSession));
        fetch(`${API_URLS.users}?id=${sessionData.id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Id': sessionData.id.toString()
          }
        })
        .then(res => res.json())
        .then(userData => {
          if (userData && userData.id) {
            const normalized = normalizeUser(userData);
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
          }
        })
        .catch(err => console.error('Cookie auth failed:', err));
      } catch (e) {
        console.error('Invalid cookie session:', e);
        cookies.remove('user_session');
      }
      return;
    }
    
    if (savedUser) {
      const userData = normalizeUser(JSON.parse(savedUser));
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
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
            const normalized = normalizeUser(serverUser);
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
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