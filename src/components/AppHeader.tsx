import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import NotificationBell from '@/components/NotificationBell';
import { API_ENDPOINTS } from '@/config/api';
import { useTheme } from '@/contexts/ThemeContext';
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
  onWithdrawalClick?: () => void;
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  userName?: string;
  userAvatar?: string;
  userBalance?: number;
  isDemoMode?: boolean;
}

export default function AppHeader({ onMessagesClick, onProfileClick, onLogout, onRefreshData, onWithdrawalClick, userRole, userId, userName = 'Пользователь', userAvatar, userBalance, isDemoMode = false }: AppHeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [balance, setBalance] = useState<number | null>(userBalance !== undefined ? userBalance : null);
  const { currentTheme } = useTheme();
  


  useEffect(() => {
    if (userBalance !== undefined) {
      setBalance(userBalance);
    }
  }, [userBalance]);

  useEffect(() => {
    loadUnreadCount();
    if (userBalance === undefined) {
      loadBalance();
    }
    
    const interval = setInterval(() => {
      loadUnreadCount();
      if (userBalance === undefined) {
        loadBalance();
      }
    }, 60000);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUnreadCount();
        if (userBalance === undefined) {
          loadBalance();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, userBalance]);

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
      const response = await fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        if (user && user.balance !== undefined && user.balance !== null) {
          const balanceValue = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance);
          setBalance(isNaN(balanceValue) ? 0 : balanceValue);
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
          {currentTheme === 'spring' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.8))' }}>
              🌸
            </div>
          )}
          {currentTheme === 'summer' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-spin" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))', animationDuration: '3s' }}>
              ☀️
            </div>
          )}
          {currentTheme === 'autumn' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.8))', animation: 'fall 3s ease-in-out infinite' }}>
              🍂
            </div>
          )}
          {currentTheme === 'winter' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-bounce" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}>
              🎅
            </div>
          )}
          {currentTheme === 'sunset' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 113, 133, 0.8))' }}>
              🌅
            </div>
          )}
          {currentTheme === 'ocean' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))', animation: 'wave 2s ease-in-out infinite' }}>
              🌊
            </div>
          )}
          {currentTheme === 'forest' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl" style={{ filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.8))', animation: 'sway 3s ease-in-out infinite' }}>
              🌲
            </div>
          )}
          {currentTheme === 'cosmic' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.9))', animationDuration: '2s' }}>
              ✨
            </div>
          )}
          {currentTheme === 'lavender' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(196, 181, 253, 0.8))' }}>
              💜
            </div>
          )}
          {currentTheme === 'cherry' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-bounce" style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))' }}>
              🍒
            </div>
          )}
          {currentTheme === 'mint' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.8))' }}>
              🌿
            </div>
          )}
          {currentTheme === 'amber' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))', animationDuration: '1.5s' }}>
              🟡
            </div>
          )}
          {currentTheme === 'neon' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.9))', animationDuration: '0.8s' }}>
              ⚡
            </div>
          )}
          {currentTheme === 'midnight' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.9))', animationDuration: '2.5s' }}>
              🌙
            </div>
          )}
          {currentTheme === 'peach' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-bounce" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.8))' }}>
              🍑
            </div>
          )}
          {currentTheme === 'emerald' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }}>
              💚
            </div>
          )}
          <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
        </div>
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-primary">420</h1>
          <p className="text-xs text-primary/60 tracking-wider">Музыкальный лейбл</p>
        </div>
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-3">
        <NotificationBell userId={userId} />
        {isDemoMode ? (
          <Button 
            onClick={() => window.location.href = '/app'}
            className="bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 hover:shadow-2xl hover:shadow-gold-500/50 text-black font-bold transition-all duration-300 hover:scale-105"
          >
            <Icon name="LogIn" size={16} className="mr-2" />
            Войти
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 transition-colors min-w-0">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold flex-shrink-0 ${userAvatar ? 'hidden' : ''}`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                {balance !== null && (
                  <div className="flex items-center gap-1 min-w-0">
                    <Icon name="Wallet" size={16} className="text-primary flex-shrink-0" />
                    <span className="font-semibold text-sm whitespace-nowrap">{Number(balance || 0).toFixed(2)} ₽</span>
                  </div>
                )}
                <Icon name="ChevronDown" size={16} className="flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onProfileClick}>
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </DropdownMenuItem>
            {userRole === 'artist' && balance !== null && balance >= 1000 && onWithdrawalClick && (
              <DropdownMenuItem onClick={onWithdrawalClick}>
                <Icon name="Wallet" size={16} className="mr-2" />
                Запрос на вывод
              </DropdownMenuItem>
            )}
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
        )}
      </div>

      {/* Mobile menu */}
      <div className="flex md:hidden items-center gap-2">
        <NotificationBell userId={userId} />
        {isDemoMode && (
          <Button 
            onClick={() => window.location.href = '/app'}
            size="sm"
            className="bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 text-black font-bold"
          >
            <Icon name="LogIn" size={16} />
          </Button>
        )}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-2 py-1.5 min-w-0">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs font-bold flex-shrink-0 ${userAvatar ? 'hidden' : ''}`}>
                {userName.charAt(0).toUpperCase()}
              </div>
              {balance !== null && (
                <span className="font-semibold text-xs whitespace-nowrap">{Number(balance || 0).toFixed(2)} ₽</span>
              )}
              <Icon name="ChevronDown" size={14} className="flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onProfileClick}>
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </DropdownMenuItem>
            {userRole === 'artist' && balance !== null && balance >= 1000 && onWithdrawalClick && (
              <DropdownMenuItem onClick={onWithdrawalClick}>
                <Icon name="Wallet" size={16} className="mr-2" />
                Запрос на вывод
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
    </div>
  );
}