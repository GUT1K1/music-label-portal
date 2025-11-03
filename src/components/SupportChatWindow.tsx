import { useRef, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  attachment_name?: string;
  sender_name?: string;
  sender_role?: string;
}

interface ThreadData {
  id: number;
  subject: string;
  status: 'new' | 'in_progress' | 'resolved';
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
  rating?: number;
  release_id?: number;
  track_id?: number;
  release_title?: string;
  release_cover?: string;
  track_title?: string;
}

interface Release {
  id: number;
  title: string;
  cover_url?: string;
  status: string;
}

interface Track {
  id: number;
  title: string;
  release_id: number;
  release_title: string;
}

interface SupportChatWindowProps {
  threadData: ThreadData | null;
  messages: Message[];
  userId: number;
  newMessage: string;
  sendingMessage: boolean;
  isStaff: boolean;
  releases?: Release[];
  tracks?: Track[];
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onStatusChange?: (status: string) => void;
  onRatingSubmit?: (rating: number) => void;
  onAttachRelease?: (releaseId: number | null, trackId: number | null) => void;
}

export default function SupportChatWindow({
  threadData,
  messages,
  userId,
  newMessage,
  sendingMessage,
  isStaff,
  releases = [],
  tracks = [],
  onMessageChange,
  onSendMessage,
  onStatusChange,
  onRatingSubmit,
  onAttachRelease
}: SupportChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  
  const handleAttach = () => {
    if (onAttachRelease) {
      onAttachRelease(selectedRelease, selectedTrack);
    }
    setShowAttachModal(false);
    setSelectedRelease(null);
    setSelectedTrack(null);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    }
  }, [messages]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  if (!threadData) {
    return (
      <Card className="lg:col-span-2 flex flex-col">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-2">
            <Icon name="MessageSquare" className="w-16 h-16 mx-auto opacity-50" />
            <p>Выберите диалог</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 flex flex-col h-[600px]">
      <CardHeader className="flex flex-col space-y-2 pb-3 px-4 py-3">
        <div className="flex flex-row items-center justify-between space-y-0">
        {isStaff ? (
          <>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={threadData.artist_avatar || threadData.artist_vk_photo} />
                <AvatarFallback className="bg-primary/10 text-xs">
                  {threadData.artist_name?.[0] || threadData.artist_username?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {threadData.artist_name || threadData.artist_username}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  @{threadData.artist_username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(threadData.status)}
              {onStatusChange && threadData.status !== 'resolved' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange('resolved')}
                  className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Icon name="Check" className="w-3 h-3 mr-1" />
                  Завершить
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Headphones" className="w-4 h-4 text-primary" />
              </div>
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
      <Separator />
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollAreaRef}>
        <div className="space-y-reverse space-y-2 min-h-full flex flex-col-reverse justify-start">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender_id !== userId && (
                <Avatar className="w-7 h-7 shrink-0">
                  {isStaff ? (
                    <>
                      <AvatarImage src={threadData.artist_avatar || threadData.artist_vk_photo} />
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {threadData.artist_name?.[0] || '?'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/support-avatar.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Icon name="Headphones" className="w-3 h-3" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              )}
              <div className={`max-w-[75%] ${msg.sender_id === userId ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-3 py-1.5 ${
                    msg.sender_id === userId
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 px-2">
                  {format(new Date(msg.created_at), 'd MMM, HH:mm', { locale: ru })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3 bg-muted/30">
        <div className="flex gap-2">
          {!isStaff && onAttachRelease && releases.length > 0 && (
            <Button
              onClick={() => setShowAttachModal(true)}
              variant="outline"
              size="sm"
              className="h-9 px-3 shrink-0"
              title="Прикрепить релиз"
            >
              <Icon name="Paperclip" className="w-4 h-4" />
            </Button>
          )}
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendingMessage}
            className="flex-1 h-9 text-sm"
          />
          <Button 
            size="sm"
            onClick={onSendMessage} 
            disabled={sendingMessage || !newMessage.trim()}
            className="h-9 px-3 bg-blue-500 hover:bg-blue-600 text-white shrink-0"
          >
            {sendingMessage ? (
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="Send" className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      
      {showAttachModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAttachModal(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-base">Прикрепить релиз или трек</CardTitle>
            </CardHeader>
            <div className="p-4 space-y-4">
              {releases.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Релиз (опционально)</label>
                  <Select value={selectedRelease?.toString() || ''} onValueChange={(val) => setSelectedRelease(val ? Number(val) : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Не выбрано" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Не выбрано</SelectItem>
                      {releases.map(release => (
                        <SelectItem key={release.id} value={release.id.toString()}>
                          {release.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {tracks.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Трек (опционально)</label>
                  <Select value={selectedTrack?.toString() || ''} onValueChange={(val) => setSelectedTrack(val ? Number(val) : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Не выбрано" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Не выбрано</SelectItem>
                      {tracks.map(track => (
                        <SelectItem key={track.id} value={track.id.toString()}>
                          {track.title} ({track.release_title})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAttachModal(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAttach}>
                  Прикрепить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}