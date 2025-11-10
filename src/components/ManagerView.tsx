import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import SupportChat from '@/components/SupportChat';
import SubmissionsManager from '@/components/SubmissionsManager';
import ManagerStats from '@/components/ManagerStats';
import ManagerTasksView from '@/components/ManagerTasksView';
import ReleaseModerationPanel from '@/components/ReleaseModerationPanel';
import MessagesModal from '@/components/MessagesModal';
import AppHeader from '@/components/AppHeader';
import UserProfile from '@/components/UserProfile';
import NewsView from '@/components/NewsView';
import FinancialReportsUpload from '@/components/FinancialReportsUpload';
import { User } from '@/types';
import { Task } from '@/components/useTasks';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useActivityTracking } from '@/hooks/useActivityTracking';

interface ManagerViewProps {
  user: User;
  tasks: Task[];
  messagesOpen: boolean;
  onUpdateTaskStatus: (taskId: number, status: string, completionReport?: string, completionFile?: File) => Promise<boolean>;
  onMessagesOpenChange: (open: boolean) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
  onRefreshData?: () => void;
}

export default function ManagerView({
  user,
  tasks,
  messagesOpen,
  onUpdateTaskStatus,
  onMessagesOpenChange,
  onUpdateUser,
  onLogout,
  onRefreshData
}: ManagerViewProps) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('manager_active_tab') || 'news';
  });
  const [showProfile, setShowProfile] = useState(false);

  const { unreadCounts } = useNotifications();
  useOnlineStatus(user.id);
  useActivityTracking(user.id);

  // Отладка для аватара
  console.log('🔍 ManagerView - user object:', user);
  console.log('🔍 ManagerView - avatar fields:', {
    avatar: user.avatar,
    vk_photo: user.vk_photo,
    photo: (user as any).photo,
    avatarValue: user.avatar || user.vk_photo
  });

  const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black bg-grid-pattern">
      <div className="container mx-auto p-4 animate-fadeIn">
        <div className="sticky top-0 z-30">
          <AppHeader 
            onMessagesClick={() => onMessagesOpenChange(true)}
            onProfileClick={() => setShowProfile(true)}
            onLogout={onLogout}
            onRefreshData={onRefreshData}
            userRole="manager"
            userId={user.id}
            userName={user.full_name}
            userAvatar={user.avatar || user.vk_photo}
            userBalance={user.balance}
          />
        </div>

        <MessagesModal 
          open={messagesOpen} 
          onOpenChange={onMessagesOpenChange}
          userId={user.id}
          userRole="manager"
        />

        <Tabs 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            localStorage.setItem('manager_active_tab', value);
          }}
          className="w-full mt-4">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex min-w-full bg-card/60 backdrop-blur-sm border border-border rounded-xl p-1.5 gap-1">
              <TabsTrigger value="news" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="Newspaper" className="w-4 h-4 text-yellow-500" />
                <span>Новости</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="CheckSquare" className="w-4 h-4 text-green-500" />
                <span>Задачи</span>
                {unreadCounts.tasks > 0 && <Badge count={unreadCounts.tasks} />}
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="MessageSquare" className="w-4 h-4 text-blue-500" />
                <span>Поддержка</span>
              </TabsTrigger>
              <TabsTrigger value="releases" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="Music" className="w-4 h-4 text-purple-500" />
                <span>Релизы</span>
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="ClipboardList" className="w-4 h-4 text-blue-500" />
                <span>Питчинг</span>
              </TabsTrigger>
              <TabsTrigger value="kpi" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="BarChart3" className="w-4 h-4 text-orange-500" />
                <span>КПД</span>
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
                <Icon name="Wallet" className="w-4 h-4 text-green-500" />
                <span>Финансы</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="news">
            <NewsView 
              userRole="manager" 
              userId={user.id} 
              telegramLinked={!!user.telegram_chat_id}
              userBalance={user.balance}
              onRefreshData={onRefreshData}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <ManagerTasksView 
              tasks={tasks}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>

          <TabsContent value="releases">
            <ReleaseModerationPanel userId={user.id} userRole="manager" />
          </TabsContent>

          <TabsContent value="finance">
            {user.id === 1 ? (
              <FinancialReportsUpload userId={user.id} />
            ) : (
              <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-12 text-center">
                <Icon name="Lock" className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Доступ ограничен</h3>
                <p className="text-gray-400">Загрузка финансовых отчётов доступна только руководителю</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="support">
            <SupportChat userId={user.id} userRole="manager" />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsManager userId={user.id} userRole="manager" />
          </TabsContent>

          <TabsContent value="kpi">
            <ManagerStats userId={user.id} />
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
      </div>


    </div>
  );
}