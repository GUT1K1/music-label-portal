import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ReleaseManager from '@/components/ReleaseManager';
import SupportChat from '@/components/SupportChat';
import AppHeader from '@/components/AppHeader';
import UserProfile from '@/components/UserProfile';
import NewsView from '@/components/NewsView';
import WithdrawalDialog from '@/components/WithdrawalDialog';
import ArtistAnalytics from '@/components/ArtistAnalytics';
import ArtistFinance from '@/components/ArtistFinance';
import AppearanceSettings from '@/components/DirectorSettings/AppearanceSettings';
import { User, Ticket, NewTicket } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useActivityTracking } from '@/hooks/useActivityTracking';

interface ArtistViewSidebarProps {
  user: User;
  tickets: Ticket[];
  statusFilter: string;
  newTicket: NewTicket;
  selectedTicketFile: File | null;
  uploadingTicket: boolean;
  messagesOpen: boolean;
  onStatusFilterChange: (filter: string) => void;
  onTicketChange: (ticket: NewTicket) => void;
  onCreateTicket: () => void;
  onFileChange: (file: File | null) => void;
  onLoadTickets: () => void;
  onMessagesOpenChange: (open: boolean) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
  onRefreshData?: () => void;
  isDemoMode?: boolean;
}

export default function ArtistViewSidebar({
  user,
  onUpdateUser,
  onLogout,
  onRefreshData,
  isDemoMode = false
}: ArtistViewSidebarProps) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('artist_active_tab') || 'news';
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { unreadCounts } = useNotifications();
  useOnlineStatus(user.id);
  useActivityTracking(user.id);

  const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const menuItems = [
    { id: 'news', label: 'Новости', icon: 'Newspaper', color: 'text-yellow-500', count: 0 },
    { id: 'tracks', label: 'Релизы', icon: 'Music', color: 'text-purple-500', count: 0 },
    { id: 'analytics', label: 'Аналитика', icon: 'BarChart3', color: 'text-cyan-500', count: 0 },
    { id: 'finance', label: 'Финансы', icon: 'Wallet', color: 'text-orange-500', count: 0 },
    { id: 'support', label: 'Поддержка', icon: 'MessageSquare', color: 'text-blue-500', count: unreadCounts.supportMessages || 0 },
    { id: 'theme', label: 'Тема', icon: 'Palette', color: 'text-pink-500', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: Гамбургер меню */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-card/95 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all shadow-lg"
      >
        <Icon name={sidebarOpen ? "X" : "Menu"} className="w-6 h-6 text-primary" />
      </button>

      {/* Overlay для мобильных */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Боковая панель */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-card/95 backdrop-blur-sm border-r border-border flex-col p-4 gap-2 z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:flex lg:translate-x-0
      `}>
        {/* Шапка с аватаром и балансом */}
        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={user.avatar || user.vk_photo || 'https://via.placeholder.com/48'} 
              alt={user.full_name}
              className="w-12 h-12 rounded-full border-2 border-primary"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-foreground truncate">{user.full_name}</h2>
              <button 
                onClick={() => setShowProfile(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Профиль
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Wallet" className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-400">
                {user.balance?.toLocaleString('ru-RU') || 0} ₽
              </span>
            </div>
            <button
              onClick={() => setShowWithdrawal(true)}
              className="text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              Вывести
            </button>
          </div>
        </div>
        
        {/* Навигация */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                localStorage.setItem('artist_active_tab', item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-accent/20 text-foreground'
              }`}
            >
              <Icon name={item.icon as any} className={`w-5 h-5 ${item.color} shrink-0`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && <Badge count={item.count} />}
            </button>
          ))}
        </nav>
        
        {/* Нижние кнопки */}
        <div className="pt-4 border-t border-border space-y-1">
          <button
            onClick={onRefreshData}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all w-full"
          >
            <Icon name="RefreshCw" className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Обновить</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-500 transition-all w-full"
          >
            <Icon name="LogOut" className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 animate-fadeIn">
          {activeTab === 'news' && (
            <NewsView 
              userRole="artist" 
              userId={user.id} 
              telegramLinked={!!user.telegram_chat_id}
              userBalance={user.balance}
              onRefreshData={onRefreshData}
            />
          )}

          {activeTab === 'tracks' && (
            <ReleaseManager userId={user.id} userRole="artist" isDemoMode={isDemoMode} />
          )}

          {activeTab === 'analytics' && (
            <ArtistAnalytics userId={user.id} />
          )}

          {activeTab === 'finance' && (
            <ArtistFinance userId={user.id} userBalance={user.balance} onRefreshData={onRefreshData} />
          )}

          {activeTab === 'support' && (
            <SupportChat userId={user.id} userRole="artist" />
          )}

          {activeTab === 'theme' && (
            <AppearanceSettings userId={user.id} />
          )}
        </div>
      </main>

      {/* Модальное окно профиля */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <UserProfile 
              user={{
                ...user,
                login: user.username,
                fullName: user.full_name,
                email: user.email || '',
                isBlocked: user.is_blocked || false,
                isFrozen: user.is_frozen || false,
                freezeUntil: user.frozen_until || ''
              }}
              onUpdateProfile={onUpdateUser}
              onClose={() => setShowProfile(false)}
            />
          </div>
        </div>
      )}

      {/* Диалог вывода средств */}
      <WithdrawalDialog 
        open={showWithdrawal}
        onOpenChange={setShowWithdrawal}
        userId={user.id}
        currentBalance={user.balance}
        onSuccess={() => {
          onRefreshData?.();
          setShowWithdrawal(false);
        }}
      />
    </div>
  );
}
