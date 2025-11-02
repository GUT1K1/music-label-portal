import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import NotificationBell from '@/components/NotificationBell';
import { API_ENDPOINTS } from '@/config/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  onMessagesClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  onRefreshData?: () => void;
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  userName?: string;
}

export default function AppHeader({ onMessagesClick, onProfileClick, onLogout, onRefreshData, userRole, userId, userName = 'Пользователь' }: AppHeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    loadUnreadCount();
    loadBalance();
    
    const interval = setInterval(() => {
      loadUnreadCount();
      loadBalance();
    }, 60000);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUnreadCount();
        loadBalance();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.MESSAGES}?user_id=${userId}&list_dialogs=true`);
      if (response.ok) {
        const dialogs = await response.json();
        const total = Array.isArray(dialogs) 
          ? dialogs.reduce((sum: number, dialog: any) => sum + (dialog.unread_count || 0), 0) 
          : 0;
        setUnreadCount(total);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.USERS}`, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      if (response.ok) {
        const data = await response.json();
        const users = data.users || data;
        const currentUser = Array.isArray(users) ? users.find((u: any) => u.id === userId) : null;
        if (currentUser && currentUser.balance !== undefined && currentUser.balance !== null) {
          setBalance(parseFloat(currentUser.balance) || 0);
        }
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const getMessagesLabel = () => {
    if (userRole === 'manager') return 'Написать руководителю';
    return 'Сообщения от команды';
  };

  return (
    <div className="flex justify-between items-center bg-card/60 backdrop-blur-sm border border-border rounded-xl p-3 md:p-4 animate-slideIn">
      <div className="flex items-center gap-2 md:gap-4 group cursor-pointer">
        <div className="relative">
          <img 
            src="https://cdn.poehali.dev/files/89837016-5bd9-4196-8bef-fad51c37ba4e.jpg" 
            alt="420 Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl shadow-2xl shadow-primary/50 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/30"
          />
          <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black animate-shimmer">420</h1>
          <p className="text-xs text-primary/60 tracking-wider">Музыкальный лейбл</p>
        </div>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-3">
        {balance !== null && (
          <div 
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30 cursor-help"
            title="Вывод доступен от 1000₽"
          >
            <Icon name="Wallet" size={18} className="text-primary" />
            <span className="font-semibold text-sm">{balance.toFixed(2)} ₽</span>
          </div>
        )}
        <NotificationBell userId={userId} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{userName.split(' ')[0]}</span>
              <Icon name="ChevronDown" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onProfileClick}>
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </DropdownMenuItem>
            {userRole !== 'artist' && (
              <DropdownMenuItem onClick={onMessagesClick} className={unreadCount > 0 ? 'text-red-400' : ''}>
                <Icon name="MessageSquare" size={16} className="mr-2" />
                {getMessagesLabel()}
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
            )}
            {onRefreshData && (
              <DropdownMenuItem onClick={onRefreshData}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400" onClick={onLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile menu */}
      <div className="flex md:hidden items-center gap-2">
        {balance !== null && (
          <div 
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30 cursor-help"
            title="Вывод доступен от 1000₽"
          >
            <Icon name="Wallet" size={14} className="text-primary" />
            <span className="font-semibold text-xs">{balance.toFixed(2)}</span>
          </div>
        )}
        <NotificationBell userId={userId} />
        {userRole !== 'artist' && (
          <Button
            onClick={onMessagesClick}
            variant="outline"
            size="sm"
            className={`relative p-2 ${unreadCount > 0 ? 'animate-pulse border-red-500' : ''}`}
          >
            <Icon name="MessageSquare" size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        )}
        {onRefreshData && (
          <Button
            onClick={onRefreshData}
            variant="outline"
            size="sm"
            className="p-2"
            title="Обновить данные профиля"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
        )}
        <Button
          onClick={onProfileClick}
          variant="outline"
          size="sm"
          className="p-2"
        >
          <Icon name="User" size={16} />
        </Button>
        <button 
          onClick={onLogout}
          className="px-3 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all text-xs"
        >
          <Icon name="LogOut" size={16} />
        </button>
      </div>
    </div>
  );
}