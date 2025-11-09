import { ReactNode } from 'react';
import AppHeader from '@/components/AppHeader';
import SideMenu from '@/components/SideMenu';
import NotificationBell from '@/components/NotificationBell';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AppHeader />
      
      <div className="flex">
        <SideMenu />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <NotificationBell />
    </div>
  );
}
