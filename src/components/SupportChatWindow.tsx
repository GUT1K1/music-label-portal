import { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
  status: 'new' | 'in_progress' | 'waiting' | 'resolved';
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
}

interface SupportChatWindowProps {
  threadData: ThreadData | null;
  messages: Message[];
  userId: number;
  newMessage: string;
  sendingMessage: boolean;
  isStaff: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export default function SupportChatWindow({
  threadData,
  messages,
  userId,
  newMessage,
  sendingMessage,
  isStaff,
  onMessageChange,
  onSendMessage
}: SupportChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Новое', variant: 'default' as const, icon: 'CircleDot' },
      in_progress: { label: 'В работе', variant: 'secondary' as const, icon: 'Clock' },
      waiting: { label: 'Ожидание', variant: 'outline' as const, icon: 'Pause' },
      resolved: { label: 'Решено', variant: 'default' as const, icon: 'CheckCircle' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <Icon name={config.icon} className="w-3 h-3" />
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
    <Card className="lg:col-span-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        {isStaff ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={threadData.artist_avatar || threadData.artist_vk_photo} />
                <AvatarFallback className="bg-primary/10">
                  {threadData.artist_name?.[0] || threadData.artist_username?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {threadData.artist_name || threadData.artist_username}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  @{threadData.artist_username}
                </p>
              </div>
            </div>
            {getStatusBadge(threadData.status)}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Headphones" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Техническая поддержка</CardTitle>
                <p className="text-sm text-muted-foreground">Мы здесь, чтобы помочь</p>
              </div>
            </div>
            {getStatusBadge(threadData.status)}
          </>
        )}
      </CardHeader>
      <Separator />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender_id !== userId && (
                <Avatar className="w-8 h-8">
                  {isStaff ? (
                    <>
                      <AvatarImage src={threadData.artist_avatar || threadData.artist_vk_photo} />
                      <AvatarFallback className="bg-primary/10">
                        {threadData.artist_name?.[0] || '?'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/support-avatar.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Icon name="Headphones" className="w-4 h-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              )}
              <div className={`max-w-[70%] ${msg.sender_id === userId ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.sender_id === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {format(new Date(msg.created_at), 'd MMMM, HH:mm', { locale: ru })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendingMessage}
            className="flex-1"
          />
          <Button onClick={onSendMessage} disabled={sendingMessage || !newMessage.trim()}>
            {sendingMessage ? (
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="Send" className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
