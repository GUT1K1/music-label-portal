import { useState, lazy, Suspense, useCallback, memo } from 'react';
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