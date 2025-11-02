import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MobileNav from '@/components/MobileNav';
import SupportChat from '@/components/SupportChat';
import UserManagement from '@/components/UserManagement';
import ReminderSetup from '@/components/ReminderSetup';
import TelegramBotSettings from '@/components/TelegramBotSettings';

import UserActivityMonitor from '@/components/UserActivityMonitor';
import UserActivityStats from '@/components/UserActivityStats';
import HomePage from '@/components/HomePage';
import ReportsUploader from '@/components/ReportsUploader';
import SubmissionsManager from '@/components/SubmissionsManager';
import TaskAssignment from '@/components/TaskAssignment';
import AnalyticsView from '@/components/AnalyticsView';
import WeeklyReport from '@/components/WeeklyReport';
import ReleaseModerationPanel from '@/components/ReleaseModerationPanel';
import NewsView from '@/components/NewsView';
import { Task } from '@/components/useTasks';
import TasksTab from '@/components/TasksTab';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useActivityTracking } from '@/hooks/useActivityTracking';

interface User {
  id: number;
  username: string;
  role: 'artist' | 'manager' | 'director';
  full_name: string;
  social_links_filled?: boolean;
  yandex_music_url?: string;
  vk_group_url?: string;
  tiktok_url?: string;
  is_blocked?: boolean;
  is_frozen?: boolean;
  frozen_until?: string;
  blocked_reason?: string;
  last_ip?: string;
  device_fingerprint?: string;
}

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_by: number;
  creator_name: string;
  created_at: string;
  assigned_to?: number | null;
  assigned_name?: string | null;
  deadline?: string | null;
}

interface DirectorTabsProps {
  user: User;
  managers: User[];
  allUsers: User[];
  newUser: { username: string; full_name: string; role: string };
  tasks: Task[];
  onCreateTask: (task: any) => Promise<boolean>;
  onUpdateTaskStatus: (taskId: number, status: string, completionReport?: string, completionFile?: File) => Promise<boolean>;
  onDeleteTask: (taskId: number) => Promise<boolean>;
  onNewUserChange: (user: { username: string; full_name: string; role: string }) => void;
  onCreateUser: () => void;
  onLoadAllUsers: () => void;
  onUpdateUser: (userId: number, userData: Partial<User>) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export default function DirectorTabs({
  user,
  managers,
  allUsers,
  newUser,
  tasks,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onNewUserChange,
  onCreateUser,
  onLoadAllUsers,
  onUpdateUser,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange
}: DirectorTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    return localStorage.getItem('director_active_tab') || 'news';
  });
  
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;
  const setActiveTab = propOnTabChange || setInternalActiveTab;

  const { unreadCounts, refreshCounts } = useNotifications();
  const { isUserOnline, getUserLastSeen } = useOnlineStatus(user.id);
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
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => {
        setActiveTab(value);
        localStorage.setItem('director_active_tab', value);
      }} 
      className="w-full">
      <div className="w-full overflow-x-auto scrollbar-hide mt-4">
        <TabsList className="inline-flex min-w-full bg-card/60 backdrop-blur-sm border border-border rounded-xl p-1.5 gap-1">
          <TabsTrigger value="news" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="Newspaper" className="w-4 h-4 text-yellow-500" />
            <span>Новости</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="BarChart3" className="w-4 h-4 text-primary" />
            <span>Аналитика</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="MessageSquare" className="w-4 h-4 text-blue-500" />
            <span>Поддержка</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="CheckSquare" className="w-4 h-4 text-green-500" />
            <span>Задачи</span>
            {unreadCounts.tasks > 0 && <Badge count={unreadCounts.tasks} />}
          </TabsTrigger>
          <TabsTrigger value="releases" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="Music" className="w-4 h-4 text-purple-500" />
            <span>Релизы</span>
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="ClipboardList" className="w-4 h-4 text-blue-500" />
            <span>Заявки</span>
            {unreadCounts.submissions > 0 && <Badge count={unreadCounts.submissions} />}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="FolderOpen" className="w-4 h-4 text-orange-500" />
            <span>Отчёты</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap">
            <Icon name="Settings" className="w-4 h-4 text-gray-500" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="news" className="animate-fadeIn">
        <NewsView userRole="director" userId={user.id} />
      </TabsContent>

      <TabsContent value="support" className="space-y-4 animate-fadeIn">
        <SupportChat userId={user.id} userRole="director" />
      </TabsContent>

      <TabsContent value="releases" className="animate-fadeIn">
        <ReleaseModerationPanel userId={user.id} userRole="director" />
      </TabsContent>

      <TabsContent value="submissions" className="animate-fadeIn">
        <SubmissionsManager userId={user.id} userRole="director" />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4 animate-fadeIn">
        <TasksTab
          tasks={tasks}
          managers={managers}
          onCreateTask={onCreateTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onDeleteTask={onDeleteTask}
        />
      </TabsContent>

      <TabsContent value="analytics" className="animate-fadeIn">
        <AnalyticsView />
      </TabsContent>

      <TabsContent value="reports" className="animate-fadeIn">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-1">
            <TabsTrigger value="weekly" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Icon name="Calendar" className="w-4 h-4 text-primary" />
              Еженедельный отчёт
            </TabsTrigger>
            <TabsTrigger value="upload" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Icon name="Upload" className="w-4 h-4 text-green-500" />
              Загрузить отчёт
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="animate-fadeIn">
            <WeeklyReport />
          </TabsContent>
          <TabsContent value="upload" className="animate-fadeIn">
            <ReportsUploader userId={user.id} />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="settings" className="animate-fadeIn">
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="mb-4 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-1">
            <TabsTrigger value="team" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Icon name="Users" className="w-4 h-4 text-primary" />
              Команда
            </TabsTrigger>
            <TabsTrigger value="reminders" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Icon name="Bell" className="w-4 h-4 text-yellow-500 animate-pulse" />
              Напоминания
            </TabsTrigger>
            <TabsTrigger value="telegram" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Icon name="MessageCircle" className="w-4 h-4 text-blue-500" />
              Telegram бот
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="animate-fadeIn">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-4 bg-card/60 backdrop-blur-sm border border-border rounded-xl p-1">
                <TabsTrigger value="users" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <Icon name="UserCircle" className="w-4 h-4 text-green-500" />
                  Пользователи
                </TabsTrigger>
                <TabsTrigger value="activity" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <Icon name="TrendingUp" className="w-4 h-4 text-blue-500" />
                  Статистика активности
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <Icon name="Activity" className="w-4 h-4 text-orange-500 animate-pulse" />
                  Мониторинг активности
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="animate-fadeIn">
                <UserManagement
                  allUsers={allUsers}
                  newUser={newUser}
                  onNewUserChange={onNewUserChange}
                  onCreateUser={onCreateUser}
                  onUpdateUser={onUpdateUser}
                  isUserOnline={isUserOnline}
                  getUserLastSeen={getUserLastSeen}
                />
              </TabsContent>
              
              <TabsContent value="activity" className="animate-fadeIn">
                <UserActivityStats 
                  users={allUsers}
                  isUserOnline={isUserOnline}
                  getUserLastSeen={getUserLastSeen}
                />
              </TabsContent>
              
              <TabsContent value="monitoring" className="animate-fadeIn">
                <UserActivityMonitor users={allUsers} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="reminders" className="animate-fadeIn">
            <ReminderSetup />
          </TabsContent>
          
          <TabsContent value="telegram" className="animate-fadeIn">
            <TelegramBotSettings />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}

export function DirectorMobileNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (value: string) => void }) {
  // Мобильное меню больше не используется - теперь одно меню сверху для всех экранов
  return null;
  
  const { unreadCounts } = useNotifications();
  
  const mobileNavItems = [
    { value: 'analytics', icon: 'BarChart3', label: 'Аналитика', badge: 0 },
    { value: 'tickets', icon: 'Ticket', label: 'Тикеты', badge: unreadCounts.tickets },
    { value: 'tasks', icon: 'CheckSquare', label: 'Задачи', badge: unreadCounts.tasks },
    { value: 'releases', icon: 'Music', label: 'Релизы', badge: 0 },
    { value: 'submissions', icon: 'FileText', label: 'Заявки', badge: unreadCounts.submissions },
    { value: 'reports', icon: 'FolderOpen', label: 'Отчёты', badge: 0 },
    { value: 'settings', icon: 'Settings', label: 'Настройки', badge: 0 }
  ];
  
  return (
    <MobileNav 
      items={mobileNavItems}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}