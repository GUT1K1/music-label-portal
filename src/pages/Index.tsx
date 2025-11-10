import { useState, lazy, Suspense, useCallback, memo, useEffect, useRef } from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/components/useAuth';
import { useUsers } from '@/components/useUsers';
import { useTasks } from '@/components/useTasks';
import Icon from '@/components/ui/icon';

const ArtistView = lazy(() => import('@/components/ArtistView'));
const ManagerView = lazy(() => import('@/components/ManagerView'));
const DirectorView = lazy(() => import('@/components/DirectorView'));

export default function Index() {
  const { user, login, logout, updateUserProfile, refreshUserData } = useAuth();
  const [newUser, setNewUser] = useState({ username: '', full_name: '', role: 'artist' });
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const authProcessedRef = useRef(false); // Флаг чтобы обработать только 1 раз
  
  // Проверяем демо-режим
  const isDemoMode = new URLSearchParams(window.location.search).get('demo') === 'true';

  useEffect(() => {
    const handleVKCallback = async () => {
      // Защита от повторного вызова
      if (authProcessedRef.current) {
        console.log('⚠️ VK callback already processed, skipping');
        return;
      }
      
      console.log('🔍 Checking for VK callback params...', window.location.search);
      const urlParams = new URLSearchParams(window.location.search);
      const vkCode = urlParams.get('code');
      const vkState = urlParams.get('state');
      
      console.log('🔍 VK params:', { vkCode, vkState });
      
      if (vkCode && vkState) {
        // Отмечаем что начали обработку
        authProcessedRef.current = true;
        
        console.log('🟢 VK callback detected on /app page');
        setIsProcessingAuth(true);
        
        // СРАЗУ очищаем URL чтобы при повторном рендере не было параметров
        window.history.replaceState({}, document.title, '/app');
        
        // Извлекаем code_verifier из state (формат: random__base64url(domain)__base64url(code_verifier))
        let codeVerifier = null;
        
        try {
          const stateParts = vkState.split('__');
          console.log('🔍 State parts:', stateParts.length);
          console.log('🔍 Full state:', vkState);
          
          if (stateParts.length >= 3) {
            // URL-safe base64 декодирование (добавляем паддинг обратно)
            const verifierB64 = stateParts[2].replace(/-/g, '+').replace(/_/g, '/');
            const padding = '='.repeat((4 - verifierB64.length % 4) % 4);
            codeVerifier = atob(verifierB64 + padding);
            console.log('🟢 Extracted code_verifier from state');
          } else {
            console.error('🔴 Invalid state format - expected 3 parts, got', stateParts.length);
          }
        } catch (e) {
          console.error('🔴 Failed to decode state:', e);
        }
        
        if (!codeVerifier) {
          console.error('🔴 No code_verifier found');
          window.history.replaceState({}, document.title, '/app');
          return;
        }
        
        const deviceIdFromUrl = urlParams.get('device_id'); // VK возвращает device_id в callback
        
        try {
          const response = await fetch('https://functions.poehali.dev/cb96d937-901e-4d21-aba2-d06bf4504cd9', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: vkCode,
              code_verifier: codeVerifier,
              device_id: deviceIdFromUrl,
              state: vkState
            })
          });
          
          const data = await response.json();
          
          if (data.user) {
            console.log('🟢 VK auth successful:', data.user);
            await login('', '', data.user);
            
            // Форсированно обновляем данные пользователя после авторизации
            setTimeout(() => {
              refreshUserData();
            }, 500);
            
            setIsProcessingAuth(false);
          } else {
            console.error('🔴 VK auth failed - FULL ERROR:', data);
            setIsProcessingAuth(false);
            authProcessedRef.current = false; // Сбрасываем флаг при ошибке
          }
        } catch (error) {
          console.error('🔴 VK auth error:', error);
          setIsProcessingAuth(false);
          authProcessedRef.current = false; // Сбрасываем флаг при ошибке
        }
      }
    };
    
    handleVKCallback();
  }, [login]);

  const { managers, allUsers, loadAllUsers, createUser, updateUser } = useUsers(user);
  const { tasks, createTask, updateTaskStatus, deleteTask } = useTasks(user);

  const handleCreateUser = useCallback(async () => {
    const success = await createUser(newUser);
    if (success) {
      setNewUser({ username: '', full_name: '', role: 'artist' });
    }
  }, [createUser, newUser]);

  const handleUpdateProfile = useCallback(async (userIdOrUpdates: number | Partial<User>, maybeUpdates?: Partial<User>) => {
    const updates = typeof userIdOrUpdates === 'number' ? maybeUpdates! : userIdOrUpdates;
    const userId = typeof userIdOrUpdates === 'number' ? userIdOrUpdates : user!.id;
    
    const success = await updateUser(userId, updates);
    if (success && userId === user!.id) {
      // Обновляем профиль текущего пользователя сразу
      updateUserProfile(updates);
      // Перезагружаем данные с сервера через небольшую задержку
      setTimeout(() => refreshUserData(), 300);
    }
  }, [updateUser, updateUserProfile, user, refreshUserData]);

  const LoadingFallback = memo(() => (
    <div className="min-h-screen bg-gradient-to-br from-black via-yellow-950/30 to-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  ));

  // Показываем loader пока обрабатывается VK/Telegram авторизация
  if (isProcessingAuth) {
    return <LoadingFallback />;
  }

  // Демо-режим: показываем ArtistView с моковыми данными
  if (isDemoMode) {
    const demoUser = {
      id: 0,
      username: 'demo_user',
      full_name: 'Демо Артист',
      role: 'artist' as const,
      balance: 15420.50,
      telegram_chat_id: null,
      vk_id: null,
      vk_photo: null,
      avatar: null,
      email: null,
      phone: null,
      created_at: new Date().toISOString()
    };
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ArtistView
          user={demoUser}
          tickets={[]}
          statusFilter="all"
          newTicket={{ title: '', description: '', priority: 'medium' }}
          selectedTicketFile={null}
          uploadingTicket={false}
          messagesOpen={messagesOpen}
          onStatusFilterChange={() => {}}
          onTicketChange={() => {}}
          onCreateTicket={() => {}}
          onFileChange={() => {}}
          onLoadTickets={() => {}}
          onMessagesOpenChange={setMessagesOpen}
          onUpdateUser={() => {}}
          onLogout={() => window.location.href = '/'}
          isDemoMode={true}
        />
      </Suspense>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} />;
  }

  if (user.role === 'artist') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ArtistView
        user={user}
        messagesOpen={messagesOpen}
        onMessagesOpenChange={setMessagesOpen}
        onUpdateUser={handleUpdateProfile}
        onLogout={logout}
        isDemoMode={false}
        onRefreshData={refreshUserData}
      />
      </Suspense>
    );
  }

  if (user.role === 'manager') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ManagerView
        user={user}
        tasks={tasks}
        messagesOpen={messagesOpen}
        onUpdateTaskStatus={updateTaskStatus}
        onMessagesOpenChange={setMessagesOpen}
        onUpdateUser={handleUpdateProfile}
        onLogout={logout}
        onRefreshData={refreshUserData}
      />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DirectorView
      user={user}
      managers={managers}
      allUsers={allUsers}
      tasks={tasks}
      newUser={newUser}
      messagesOpen={messagesOpen}
      onNewUserChange={setNewUser}
      onCreateUser={handleCreateUser}
      onLoadAllUsers={loadAllUsers}
      onUpdateUser={handleUpdateProfile}
      onCreateTask={createTask}
      onUpdateTaskStatus={updateTaskStatus}
      onDeleteTask={deleteTask}
      onMessagesOpenChange={setMessagesOpen}
      onLogout={logout}
      onRefreshData={refreshUserData}
    />
    </Suspense>
  );
}