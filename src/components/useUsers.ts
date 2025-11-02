import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, NewUser } from '@/types';
import { UserAPI } from '@/types/api';
import { UserService } from '@/services/user.service';
import { createNotification } from '@/hooks/useNotifications';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 300000;

function convertUserAPIToLegacy(apiUser: UserAPI): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    role: apiUser.role,
    full_name: apiUser.fullName,
    fullName: apiUser.fullName,
    avatar: apiUser.avatar,
    email: apiUser.email,
    vk_photo: apiUser.avatar,
    vk_first_name: apiUser.vkFirstName,
    vk_last_name: apiUser.vkLastName,
    telegram_id: apiUser.telegramId,
    telegram_chat_id: apiUser.telegramChatId,
    balance: apiUser.balance,
    is_blocked: apiUser.isBlocked,
    isBlocked: apiUser.isBlocked,
    is_frozen: apiUser.isFrozen,
    isFrozen: apiUser.isFrozen,
    frozen_until: apiUser.frozenUntil,
    freezeUntil: apiUser.frozenUntil,
    blocked_reason: apiUser.blockedReason,
    yandex_music_url: apiUser.yandexMusicUrl,
    vk_group_url: apiUser.vkGroupUrl,
    tiktok_url: apiUser.tiktokUrl,
    social_links_filled: apiUser.socialLinksFilled,
    last_ip: apiUser.lastIp,
    device_fingerprint: apiUser.deviceFingerprint
  };
}

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
      const apiUsers = await UserService.getManagers(user.id);
      const legacyUsers = apiUsers.map(convertUserAPIToLegacy);
      setManagers(legacyUsers);
      cacheRef.current.managers = { data: legacyUsers, timestamp: now };
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
      const apiUsers = await UserService.getAllUsers(user.id);
      const legacyUsers = apiUsers.map(convertUserAPIToLegacy);
      setAllUsers(legacyUsers);
      cacheRef.current.allUsers = { data: legacyUsers, timestamp: now };
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
      const response = await fetch(`https://functions.poehali.dev/cf5d45c1-d64b-4400-af77-a51c7588d942`, {
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
      const updates = {
        fullName: userData.fullName || userData.full_name,
        avatar: userData.avatar || userData.vk_photo,
        email: userData.email,
        balance: userData.balance,
        role: userData.role
      };

      const success = await UserService.updateUser(userId, updates, user.id);
      
      if (success) {
        toast({ title: '✅ Данные обновлены' });
        
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
        toast({ title: '❌ Ошибка обновления', variant: 'destructive' });
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
