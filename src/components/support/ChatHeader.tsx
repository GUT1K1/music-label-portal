import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface ThreadData {
  id: number;
  subject: string;
  status: 'new' | 'in_progress' | 'resolved';
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
  with_user_name?: string;
  with_user_avatar?: string;
  rating?: number;
  release_id?: number;
  track_id?: number;
  release_title?: string;
  release_cover?: string;
  track_title?: string;
}

interface ChatHeaderProps {
  threadData: ThreadData;
  isStaff: boolean;
  onStatusChange?: (status: string) => void;
  onRatingSubmit?: (rating: number) => void;
}

export default function ChatHeader({
  threadData,
  isStaff,
  onStatusChange,
  onRatingSubmit
}: ChatHeaderProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Новое', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: 'Sparkles' },
      in_progress: { label: 'В работе', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'Zap' },
      resolved: { label: 'Решено', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'CheckCircle2' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge variant="outline" className={`flex items-center gap-1.5 text-xs font-medium border ${config.color}`}>
        <Icon name={config.icon} className="w-3.5 h-3.5" />
        {config.label}
      </Badge>
    );
  };

  return (
    <CardHeader className="flex flex-col space-y-2 pb-3 px-4 py-3">
      <div className="flex flex-row items-center justify-between space-y-0">
      {isStaff ? (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={threadData.with_user_avatar} />
              <AvatarFallback className="bg-primary/10 text-xs">
                {threadData.with_user_name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {threadData.with_user_name}
              </CardTitle>
              {threadData.artist_username && (
                <p className="text-xs text-muted-foreground">
                  @{threadData.artist_username}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(threadData.status)}
            {onStatusChange && threadData.status !== 'resolved' && (
              <Button
                size="sm"
                onClick={() => onStatusChange('resolved')}
                className="h-7 text-xs gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
              >
                <Icon name="CheckCircle2" className="w-3.5 h-3.5" />
                Завершить
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-2 ring-primary/20">
              <AvatarImage src="https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/a2d10492-6925-46a2-b570-b8026c74c51e.jpg" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600">
                <Icon name="Headphones" className="w-4 h-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">Техподдержка</CardTitle>
              <p className="text-xs text-muted-foreground">Ответим на ваши вопросы</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(threadData.status)}
            {threadData.status === 'resolved' && !threadData.rating && onRatingSubmit && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingSubmit(star)}
                    className="text-yellow-500 hover:scale-110 transition-transform"
                  >
                    <Icon name="Star" className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            )}
            {threadData.rating && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Star" className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span>{threadData.rating}/5</span>
              </div>
            )}
          </div>
        </>
      )}
      </div>
      
      {(threadData.release_id || threadData.track_id) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
          <Icon name="Music" className="w-3.5 h-3.5" />
          <span>
            {threadData.track_id && threadData.track_title && `Трек: ${threadData.track_title}`}
            {threadData.release_id && threadData.release_title && !threadData.track_id && `Релиз: ${threadData.release_title}`}
          </span>
        </div>
      )}
    </CardHeader>
  );
}