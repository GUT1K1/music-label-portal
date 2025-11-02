import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, NewUser, API_URLS } from '@/types';
import { createNotification } from '@/hooks/useNotifications';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 300000;

export const useUsers = (user: User | null) => {
  const [managers, setManagers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const cacheRef = useRef<{
    managers: CacheEntry<User[]> | null;
    allUsers: CacheEntry<User[]> | null;
  }>({ managers: null, allUsers: null });

  const loadManagers = useCallback(async (force = false) => {
    if (!user?.id) return;
    
    const now = Date.now();
    const cached = cacheRef.current.managers;
    
    if (!force && cached && now - cached.timestamp < CACHE_TTL) {
      setManagers(cached.data);
      return;
    }
    
    try {
      const response = await fetch(`${API_URLS.users}?role=manager`, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      const users = data.users || [];
      setManagers(users);
      cacheRef.current.managers = { data: users, timestamp: now };
    } catch (error) {
      console.error('Failed to load managers:', error);
    }
  }, [user?.id]);

  const loadAllUsers = useCallback(async (force = false) => {
    if (!user?.id) return;
    
    const now = Date.now();
    const cached = cacheRef.current.allUsers;
    
    if (!force && cached && now - cached.timestamp < CACHE_TTL) {
      setAllUsers(cached.data);
      return;
    }
    
    try {
      const response = await fetch(API_URLS.users, {
        headers: { 'X-User-Id': user.id.toString() }
      });
      const data = await response.json();
      const users = data.users || [];
      setAllUsers(users);
      cacheRef.current.allUsers = { data: users, timestamp: now };
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, [user?.id]);

  const createUser = useCallback(async (newUser: NewUser) => {
    if (!user?.id) return false;
    
    if (!newUser.username || !newUser.full_name) {
      toast({ title: '❌ Заполните все поля', variant: 'destructive' });
      return false;
    }
    
    try {
      const response = await fetch(API_URLS.users, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({ title: '✅ Пользователь создан', description: 'Пароль по умолчанию: 12345' });
        
        // Notify directors about new user registration
        try {
          const roleLabel = data.role === 'artist' ? 'артист' : data.role === 'manager' ? 'менеджер' : 'пользователь';
          await createNotification({
            title: '🎉 Новый пользователь',
            message: `Зарегистрирован новый ${roleLabel}: ${data.full_name} (@${data.username})`,
            type: 'user_registration',
            related_entity_type: 'user',
            related_entity_id: data.user_id
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }
        
        loadAllUsers(true);
        return true;
      } else {
        const data = await response.json();
        toast({ title: '❌ Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '❌ Ошибка создания', variant: 'destructive' });
    }
    return false;
  }, [user?.id, toast, loadAllUsers]);

  const updateUser = useCallback(async (userId: number, userData: Partial<User>) => {
    if (!user?.id) return false;
    
    try {
      const payload = { id: userId, ...userData };
      const response = await fetch(API_URLS.users, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        toast({ title: '✅ Данные обновлены' });
        
        // If role was changed, notify the user to refresh their session
        if (userData.role) {
          try {
            const roleLabels = {
              'artist': 'артиста',
              'manager': 'менеджера',
              'director': 'руководителя'
            };
            await createNotification({
              title: '⚡ Ваша роль изменена',
              message: `Вам назначена роль ${roleLabels[userData.role as keyof typeof roleLabels]}. Обновите страницу для применения изменений.`,
              type: 'role_change',
              recipient_user_id: userId,
              related_entity_type: 'user',
              related_entity_id: userId
            });
            
            // Trigger a custom event that can be caught by useAuth
            window.dispatchEvent(new CustomEvent('user-role-changed', { 
              detail: { userId, newRole: userData.role } 
            }));
          } catch (notifError) {
            console.error('Failed to create role change notification:', notifError);
          }
        }
        
        loadAllUsers(true);
        return true;
      } else {
        const data = await response.json();
        toast({ title: '❌ Ошибка', description: data.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: '❌ Ошибка обновления', variant: 'destructive' });
      return false;
    }
  }, [user?.id, toast, loadAllUsers]);

  useEffect(() => {
    if (user?.role === 'director') {
      loadManagers();
      loadAllUsers();
    }
  }, [user?.role]);

  return {
    managers,
    allUsers,
    loadManagers,
    loadAllUsers,
    createUser,
    updateUser
  };
};