import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ReleaseManager from '@/components/ReleaseManager';
import SupportChat from '@/components/SupportChat';
import AppHeader from '@/components/AppHeader';
import UserProfile from '@/components/UserProfile';
import NewsView from '@/components/NewsView';
import WithdrawalDialog from '@/components/WithdrawalDialog';
import ArtistAnalytics from '@/components/ArtistAnalytics';
import ArtistFinance from '@/components/ArtistFinance';
import { User, Ticket, NewTicket } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useActivityTracking } from '@/hooks/useActivityTracking';

interface ArtistViewProps {
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
}

export default function ArtistView({
  user,
  tickets,
  statusFilter,
  newTicket,
  selectedTicketFile,
  uploadingTicket,
  messagesOpen,
  onStatusFilterChange,
  onTicketChange,
  onCreateTicket,
  onFileChange,
  onLoadTickets,
  onMessagesOpenChange,
  onUpdateUser,
  onLogout,
  onRefreshData
}: ArtistViewProps) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('artist_active_tab') || 'news';
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  const { unreadCounts } = useNotifications();
  useOnlineStatus(user.id);
  useActivityTracking(user.id);

  const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
        {count > 99 ? '99+' : count}
      </span>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-yellow-950/30 to-black bg-grid-pattern">
      <div className="w-full animate-fadeIn">
        <div className="sticky top-0 z-30 mb-2 md:mb-0 container mx-auto px-2 md:px-4">
          <AppHeader 
            onMessagesClick={() => {}}
            onProfileClick={() => setShowProfile(true)}
            onLogout={onLogout}
            onRefreshData={onRefreshData}
            onWithdrawalClick={() => setShowWithdrawal(true)}
            userRole="artist"
            userId={user.id}
            userName={user.full_name}
            userAvatar={user.avatar || user.vk_photo}
            userBalance={user.balance}
          />
        </div>

        <Tabs 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            localStorage.setItem('artist_active_tab', value);
          }}
          className="w-full mt-2 md:mt-4">
          <div className="w-full container mx-auto px-2 md:px-4">
            <TabsList className="grid w-full grid-cols-5 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-0.5 md:p-1">
              <TabsTrigger value="news" className="text-[11px] md:text-sm px-1.5 md:px-4 transition-all duration-200 md:hover:scale-105 gap-1 md:gap-2">
                <Icon name="Newspaper" className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500 shrink-0" />
                <span className="truncate">Новости</span>
              </TabsTrigger>
              <TabsTrigger value="tracks" className="text-[11px] md:text-sm px-1.5 md:px-4 transition-all duration-200 md:hover:scale-105 gap-1 md:gap-2">
                <Icon name="Music" className="w-3.5 h-3.5 md:w-5 md:h-5 text-purple-500 shrink-0" />
                <span className="truncate">Релизы</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="text-[11px] md:text-sm px-1.5 md:px-4 transition-all duration-200 md:hover:scale-105 gap-1 md:gap-2">
                <Icon name="MessageSquare" className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-500 shrink-0" />
                <span className="truncate">Поддержка</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="text-[11px] md:text-sm px-1.5 md:px-4 transition-all duration-200 md:hover:scale-105 gap-1 md:gap-2">
                <Icon name="Wallet" className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500 shrink-0" />
                <span className="truncate">Финансы</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-[11px] md:text-sm px-1.5 md:px-4 transition-all duration-200 md:hover:scale-105 gap-1 md:gap-2">
                <Icon name="BarChart3" className="w-3.5 h-3.5 md:w-5 md:h-5 text-cyan-500 shrink-0" />
                <span className="truncate">Аналитика</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="news" className="mt-2 md:mt-6 container mx-auto px-2 md:px-4">
            <NewsView 
              userRole="artist" 
              userId={user.id} 
              telegramLinked={!!user.telegram_chat_id}
              userBalance={user.balance}
              onRefreshData={onRefreshData}
            />
          </TabsContent>

          <TabsContent value="tracks" className="mt-2 md:mt-6">
            <ReleaseManager userId={user.id} userRole="artist" />
          </TabsContent>

          <TabsContent value="support" className="mt-2 md:mt-6 container mx-auto px-2 md:px-4">
            <SupportChat userId={user.id} userRole="artist" />
          </TabsContent>

          <TabsContent value="finance" className="mt-2 md:mt-6 container mx-auto px-2 md:px-4">
            <ArtistFinance userId={user.id} userBalance={user.balance} onRefreshData={onRefreshData} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-2 md:mt-6 container mx-auto px-2 md:px-4">
            <ArtistAnalytics userId={user.id} />
          </TabsContent>
        </Tabs>

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

        <WithdrawalDialog
          open={showWithdrawal}
          onOpenChange={setShowWithdrawal}
          userId={user.id}
          currentBalance={user.balance}
          onSuccess={onRefreshData}
        />
      </div>


    </div>
  );
}