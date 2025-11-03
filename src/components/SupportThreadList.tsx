import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SupportThread {
  id: number;
  subject: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'normal' | 'urgent';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
  last_message?: string;
  unread_count?: number;
}

interface SupportThreadListProps {
  threads: SupportThread[];
  activeThread: number | null;
  statusFilter: string;
  searchQuery: string;
  onThreadSelect: (threadId: number) => void;
  onStatusFilterChange: (status: string) => void;
  onSearchChange: (query: string) => void;
  onNewThreadClick: () => void;
}

export default function SupportThreadList({
  threads,
  activeThread,
  statusFilter,
  searchQuery,
  onThreadSelect,
  onStatusFilterChange,
  onSearchChange,
  onNewThreadClick
}: SupportThreadListProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Новое', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: 'Sparkles' },
      in_progress: { label: 'В работе', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'Zap' },
      resolved: { label: 'Решено', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'CheckCircle2' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge variant="outline" className={`flex items-center gap-1 text-[10px] font-medium border ${config.color}`}>
        <Icon name={config.icon} className="w-2.5 h-2.5" />
        {config.label}
      </Badge>
    );
  };

  const filteredThreads = threads.filter(thread => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      thread.subject?.toLowerCase().includes(search) ||
      thread.artist_name?.toLowerCase().includes(search) ||
      thread.artist_username?.toLowerCase().includes(search) ||
      thread.last_message?.toLowerCase().includes(search)
    );
  });

  return (
    <Card className="lg:col-span-1 flex flex-col h-[600px]">
      <CardHeader className="space-y-3 pb-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Icon name="MessageSquare" className="w-4 h-4 text-primary" />
            Диалоги
          </CardTitle>
          <Button size="sm" onClick={onNewThreadClick} className="h-7 gap-1 text-xs bg-blue-500 hover:bg-blue-600 text-white">
            <Icon name="Plus" className="w-3 h-3" />
            Новый
          </Button>
        </div>
        
        <div className="space-y-2">
          <Input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 text-sm"
          />
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="resolved">Решённые</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <Separator />
      <ScrollArea className="flex-1">
        <CardContent className="pt-3 px-3 space-y-2">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет диалогов</p>
            </div>
          ) : (
            filteredThreads.map(thread => (
              <Card
                key={thread.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeThread === thread.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => onThreadSelect(thread.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={thread.artist_avatar || thread.artist_vk_photo} />
                      <AvatarFallback className="bg-primary/10">
                        {thread.artist_name?.[0] || thread.artist_username?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">
                          {thread.artist_name || thread.artist_username}
                        </p>
                        {thread.unread_count! > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0">
                            {thread.unread_count}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        @{thread.artist_username}
                      </p>
                      
                      {thread.last_message && (
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {thread.last_message}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between gap-2">
                        {getStatusBadge(thread.status)}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(thread.last_message_at), 'd MMM, HH:mm', { locale: ru })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}