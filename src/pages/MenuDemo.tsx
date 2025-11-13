import { useState } from 'react';
import { useAuth } from '@/components/useAuth';
import AuthForm from '@/components/AuthForm';
import ArtistView from '@/components/ArtistView';
import ArtistViewSidebar from '@/components/ArtistViewSidebar';
import Icon from '@/components/ui/icon';
import LoadingFallback from '@/components/LoadingFallback';

export default function MenuDemo() {
  const { user, login, logout, updateUserProfile, refreshUserData } = useAuth();
  const [useSidebar, setUseSidebar] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const handleUpdateProfile = async (updates: any) => {
    await updateUserProfile(updates);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Демо меню</h1>
            <p className="text-muted-foreground">Войди чтобы посмотреть варианты меню</p>
          </div>
          <AuthForm onLogin={login} />
        </div>
      </div>
    );
  }

  if (user.role !== 'artist') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Доступно только для артистов</h1>
          <p className="text-muted-foreground mb-4">Эта демо-страница работает только с ролью "artist"</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  const ArtistComponent = useSidebar ? ArtistViewSidebar : ArtistView;

  return (
    <div className="relative">
      {/* Кнопка переключения */}
      <div className="fixed top-4 right-4 z-[100]">
        <button
          onClick={() => setUseSidebar(!useSidebar)}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow-2xl hover:opacity-90 transition-all font-medium border-2 border-primary/20"
        >
          <Icon name={useSidebar ? "LayoutGrid" : "PanelLeft"} className="w-5 h-5" />
          <span>{useSidebar ? 'Горизонтальные табы' : 'Боковая панель'}</span>
        </button>
      </div>

      {/* Компонент */}
      <ArtistComponent
        user={user}
        messagesOpen={messagesOpen}
        onMessagesOpenChange={setMessagesOpen}
        onUpdateUser={handleUpdateProfile}
        onLogout={logout}
        isDemoMode={false}
        onRefreshData={refreshUserData}
        tickets={[]}
        statusFilter="all"
        newTicket={{ title: '', description: '', priority: 'medium' }}
        selectedTicketFile={null}
        uploadingTicket={false}
        onStatusFilterChange={() => {}}
        onTicketChange={() => {}}
        onCreateTicket={() => {}}
        onFileChange={() => {}}
        onLoadTickets={() => {}}
      />
    </div>
  );
}
