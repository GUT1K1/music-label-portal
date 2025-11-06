import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OnlineStatusBadge from '@/components/OnlineStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from './types';

interface UserListCardProps {
  allUsers: User[];
  onBlockUser: (user: User) => void;
  onUnblockUser: (userId: number) => void;
  onFreezeUser: (user: User) => void;
  onUnfreezeUser: (userId: number) => void;
  onEditUser: (user: User) => void;
  isUserOnline?: (userId: number) => boolean;
  getUserLastSeen?: (userId: number) => string;
}

export default function UserListCard({
  allUsers,
  onBlockUser,
  onUnblockUser,
  onFreezeUser,
  onUnfreezeUser,
  onEditUser,
  isUserOnline,
  getUserLastSeen
}: UserListCardProps) {
  return (
    <Card className="border-primary/20 bg-card/95 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary text-base flex items-center gap-2">
          <Icon name="Users" size={18} />
          Все пользователи ({allUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="space-y-2 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2">
          {allUsers.map((u) => (
            <div key={u.id} className={`p-2 md:p-2.5 rounded-lg border transition-all ${u.is_blocked ? 'bg-red-500/10 border-red-500/30' : u.is_frozen ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted/30 border-border/50 hover:bg-muted/50'}`}>
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                  <Avatar className="w-9 h-9 border-2 border-primary/20 flex-shrink-0">
                    <AvatarImage src={u.avatar || u.vk_photo || undefined} alt={u.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold">
                      {u.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                    {isUserOnline && (
                      <OnlineStatusBadge 
                        isOnline={isUserOnline(u.id)} 
                        lastSeen={getUserLastSeen ? getUserLastSeen(u.id) : undefined}
                        size="sm"
                      />
                    )}
                    <p className="font-semibold text-xs md:text-sm truncate">{u.full_name}</p>
                    <Badge variant="outline" className="border-primary/50 text-[9px] md:text-[10px] px-1 md:px-1.5 py-0 flex-shrink-0">
                      {u.role === 'director' ? '👑' : u.role === 'manager' ? '🎯' : '🎤'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 md:gap-1.5 flex-wrap">
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">@{u.username}</p>
                    {u.telegram_id && (
                      <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-[10px] px-1.5 py-0">
                        <Icon name="Send" size={8} className="mr-0.5" />
                        TG
                      </Badge>
                    )}
                    {u.is_blocked && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        <Icon name="Ban" size={8} className="mr-0.5" />
                        Заблокирован
                      </Badge>
                    )}
                    {u.is_frozen && (
                      <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-[10px] px-1.5 py-0">
                        <Icon name="Snowflake" size={8} className="mr-0.5" />
                        Заморожен
                      </Badge>
                    )}
                    {u.role === 'artist' && u.revenue_share_percent && (
                      <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] px-1.5 py-0">
                        {u.revenue_share_percent}%
                      </Badge>
                    )}
                  </div>
                  {u.is_blocked && u.blocked_reason && (
                    <p className="text-[10px] md:text-xs text-red-400 mt-1 line-clamp-1">Причина: {u.blocked_reason}</p>
                  )}
                  {u.is_frozen && u.frozen_until && (
                    <p className="text-[10px] md:text-xs text-yellow-400 mt-1">До: {new Date(u.frozen_until).toLocaleString('ru-RU')}</p>
                  )}
                  </div>
                </div>
                {(onBlockUser || onFreezeUser || onEditUser) && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      onClick={() => onEditUser(u)}
                      className="h-7 w-7 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                      title="Редактировать"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    {u.is_blocked ? (
                      <Button
                        variant="ghost"
                        onClick={() => onUnblockUser(u.id)}
                        className="h-7 w-7 p-0 hover:bg-green-500/20 hover:text-green-400"
                        title="Разблокировать"
                      >
                        <Icon name="Unlock" size={14} />
                      </Button>
                    ) : u.is_frozen ? (
                      <Button
                        variant="ghost"
                        onClick={() => onUnfreezeUser(u.id)}
                        className="h-7 w-7 p-0 hover:bg-green-500/20 hover:text-green-400"
                        title="Разморозить"
                      >
                        <Icon name="Flame" size={14} />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => onBlockUser(u)}
                          className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                          title="Заблокировать"
                        >
                          <Icon name="Ban" size={14} />
                        </Button>
                        <Button
                          variant="ghost" 
                          onClick={() => onFreezeUser(u)} 
                          className="h-7 w-7 p-0 hover:bg-yellow-500/20 hover:text-yellow-400"
                          title="Заморозить"
                        >
                          <Icon name="Snowflake" size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}