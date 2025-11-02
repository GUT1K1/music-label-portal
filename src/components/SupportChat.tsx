import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SupportThread {
  id: number;
  subject: string;
  status: 'new' | 'in_progress' | 'waiting' | 'resolved';
  priority: 'normal' | 'urgent';
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

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

interface SupportChatProps {
  userId: number;
  userRole: 'artist' | 'manager' | 'boss';
}

export default function SupportChat({ userId, userRole }: SupportChatProps) {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUPPORT_URL = 'https://functions.poehali.dev/03b127de-537a-446c-af8d-01caba70e2e9';

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
    }
  }, [activeThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadThreads = async () => {
    setLoading(true);
    try {
      const response = await fetch(SUPPORT_URL, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      
      if (!response.ok) throw new Error('Failed to load threads');
      
      const data = await response.json();
      setThreads(data.threads || []);
      
      if (data.threads?.length > 0 && !activeThread) {
        setActiveThread(data.threads[0].id);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить историю обращений',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: number) => {
    try {
      const response = await fetch(`${SUPPORT_URL}?thread_id=${threadId}`, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      
      if (!response.ok) throw new Error('Failed to load messages');
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;
    
    setSendingMessage(true);
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'send_message',
          thread_id: activeThread,
          message: newMessage.trim()
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setNewMessage('');
      await loadMessages(activeThread);
      await loadThreads();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Ошибка отправки',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const createNewThread = async () => {
    const subject = 'Новый вопрос';
    
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'create_thread',
          subject,
          message: 'Здравствуйте! У меня вопрос.',
          priority: 'normal'
        })
      });
      
      if (!response.ok) throw new Error('Failed to create thread');
      
      const data = await response.json();
      await loadThreads();
      setActiveThread(data.thread_id);
      
      toast({
        title: 'Готово',
        description: 'Новое обращение создано'
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать обращение',
        variant: 'destructive'
      });
    }
  };

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

  const activeThreadData = threads.find(t => t.id === activeThread);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Icon name="MessageSquare" className="w-5 h-5 text-primary" />
            Мои обращения
          </CardTitle>
          <Button size="sm" onClick={createNewThread} className="gap-2">
            <Icon name="Plus" className="w-4 h-4" />
            Новое
          </Button>
        </CardHeader>
        <Separator />
        <ScrollArea className="flex-1">
          <CardContent className="pt-4 space-y-2">
            {threads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Нет обращений</p>
                <p className="text-sm">Создайте первое обращение</p>
              </div>
            ) : (
              threads.map(thread => (
                <Card
                  key={thread.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activeThread === thread.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setActiveThread(thread.id)}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm line-clamp-1">{thread.subject}</p>
                      {getStatusBadge(thread.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(thread.last_message_at), 'd MMMM, HH:mm', { locale: ru })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="lg:col-span-2 flex flex-col">
        {activeThreadData ? (
          <>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{activeThreadData.subject}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Создано {format(new Date(activeThreadData.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>
                {getStatusBadge(activeThreadData.status)}
              </div>
            </CardHeader>
            <Separator />
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 space-y-1 ${
                        msg.sender_id === userId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.sender_id !== userId && (
                        <p className="text-xs font-semibold opacity-70">
                          {msg.sender_name || 'Поддержка'}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      {msg.attachment_url && (
                        <a
                          href={msg.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs underline"
                        >
                          <Icon name="Paperclip" className="w-3 h-3" />
                          {msg.attachment_name}
                        </a>
                      )}
                      <p className="text-xs opacity-60">
                        {format(new Date(msg.created_at), 'HH:mm', { locale: ru })}
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
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={sendingMessage}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()}>
                  {sendingMessage ? (
                    <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon name="Send" className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Icon name="MessageCircle" className="w-16 h-16 mx-auto opacity-50" />
              <p>Выберите обращение или создайте новое</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
