import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/types';

interface ProfileStatsProps {
  user: User;
}

export const ProfileStats = React.memo(function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    { label: 'Всего событий', value: user.totalEvents || 0, icon: 'Calendar', color: 'text-blue-500' },
    { label: 'Завершено', value: user.completedEvents || 0, icon: 'CheckCircle', color: 'text-green-500' },
    { label: 'Отменено', value: user.cancelledEvents || 0, icon: 'XCircle', color: 'text-red-500' },
    { label: 'В ожидании', value: user.pendingEvents || 0, icon: 'Clock', color: 'text-orange-500' }
  ];

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Icon name="BarChart3" size={20} className="text-primary md:size-6" />
          Статистика событий
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1.5 md:space-y-2 p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all">
              <Icon name={stat.icon} size={24} className={`${stat.color} md:size-7`} />
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
