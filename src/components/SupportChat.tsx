import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
  last_message?: string;
  unread_count?: number;
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

interface Artist {
  id: number;
  username: string;
  full_name: string;
  avatar?: string;
  vk_photo?: string;
}

interface SupportChatProps {
  userId: number;
  userRole: 'artist' | 'manager' | 'director';
}

export default function SupportChat({ userId, userRole }: SupportChatProps) {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUPPORT_URL = 'https://functions.poehali.dev/03b127de-537a-446c-af8d-01caba70e2e9';

  const isStaff = userRole === 'manager' || userRole === 'director';

  useEffect(() => {
    loadThreads();
    if (isStaff) {
      loadArtists();
    }
    const interval = setInterval(loadThreads, 10000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
      const interval = setInterval(() => loadMessages(activeThread), 5000);
      return () => clearInterval(interval);
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
      const url = statusFilter !== 'all' 
        ? `${SUPPORT_URL}?status=${statusFilter}` 
        : SUPPORT_URL;
        
      const response = await fetch(url, {
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

  const loadArtists = async () => {
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'get_artists'
        })
      });
      
      if (!response.ok) throw new Error('Failed to load artists');
      
      const data = await response.json();
      setArtists(data.artists || []);
    } catch (error) {
      console.error('Error loading artists:', error);
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
    if (!isStaff) {
      const subject = 'Вопрос в поддержку';
      
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
    } else {
      if (!selectedArtist) {
        toast({
          title: 'Выберите артиста',
          variant: 'destructive'
        });
        return;
      }
      
      try {
        const response = await fetch(SUPPORT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId.toString()
          },
          body: JSON.stringify({
            action: 'create_thread',
            artist_id: selectedArtist,
            subject: newThreadSubject || 'Новое обращение',
            message: newThreadMessage || 'Здравствуйте!',
            priority: 'normal'
          })
        });
        
        if (!response.ok) throw new Error('Failed to create thread');
        
        const data = await response.json();
        await loadThreads();
        setActiveThread(data.thread_id);
        setShowNewThreadModal(false);
        setSelectedArtist(null);
        setNewThreadSubject('');
        setNewThreadMessage('');
        
        toast({
          title: 'Готово',
          description: 'Новый диалог создан'
        });
      } catch (error) {
        console.error('Error creating thread:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать диалог',
          variant: 'destructive'
        });
      }
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

  const activeThreadData = threads.find(t => t.id === activeThread);

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff && threads.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="MessageSquare" className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Техническая поддержка</h3>
            <p className="text-muted-foreground mb-6">
              Создайте первое обращение, чтобы начать диалог с поддержкой
            </p>
            <Button onClick={createNewThread} size="lg" className="gap-2">
              <Icon name="Plus" className="w-5 h-5" />
              Создать обращение
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Headphones" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Техническая поддержка</CardTitle>
                <p className="text-sm text-muted-foreground">Мы здесь, чтобы помочь</p>
              </div>
            </div>
            {activeThreadData && getStatusBadge(activeThreadData.status)}
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
                      <AvatarImage src="/support-avatar.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Icon name="Headphones" className="w-4 h-4" />
                      </AvatarFallback>
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
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Icon name="MessageSquare" className="w-5 h-5 text-primary" />
                Диалоги поддержки
              </CardTitle>
              <Button size="sm" onClick={() => setShowNewThreadModal(true)} className="gap-2">
                <Icon name="Plus" className="w-4 h-4" />
                Новый
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все диалоги</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="waiting">Ожидание</SelectItem>
                  <SelectItem value="resolved">Решённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
            <CardContent className="pt-4 space-y-2">
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
                    onClick={() => setActiveThread(thread.id)}
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

        <Card className="lg:col-span-2 flex flex-col">
          {activeThreadData ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activeThreadData.artist_avatar || activeThreadData.artist_vk_photo} />
                    <AvatarFallback className="bg-primary/10">
                      {activeThreadData.artist_name?.[0] || activeThreadData.artist_username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {activeThreadData.artist_name || activeThreadData.artist_username}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      @{activeThreadData.artist_username}
                    </p>
                  </div>
                </div>
                {getStatusBadge(activeThreadData.status)}
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
                          <AvatarImage src={activeThreadData.artist_avatar || activeThreadData.artist_vk_photo} />
                          <AvatarFallback className="bg-primary/10">
                            {activeThreadData.artist_name?.[0] || '?'}
                          </AvatarFallback>
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
                <Icon name="MessageSquare" className="w-16 h-16 mx-auto opacity-50" />
                <p>Выберите диалог</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showNewThreadModal} onOpenChange={setShowNewThreadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый диалог</DialogTitle>
            <DialogDescription>
              Выберите артиста для начала диалога
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Артист</label>
              <Select value={selectedArtist?.toString()} onValueChange={(val) => setSelectedArtist(Number(val))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите артиста" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map(artist => (
                    <SelectItem key={artist.id} value={artist.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={artist.avatar || artist.vk_photo} />
                          <AvatarFallback className="text-xs">
                            {artist.full_name[0] || artist.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{artist.full_name} (@{artist.username})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Тема (опционально)</label>
              <Input
                placeholder="Тема обращения"
                value={newThreadSubject}
                onChange={(e) => setNewThreadSubject(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Первое сообщение</label>
              <Input
                placeholder="Здравствуйте!"
                value={newThreadMessage}
                onChange={(e) => setNewThreadMessage(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewThreadModal(false)}>
                Отмена
              </Button>
              <Button onClick={createNewThread} disabled={!selectedArtist}>
                Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
