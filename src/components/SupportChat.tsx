import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import SupportThreadList from './SupportThreadList';
import SupportChatWindow from './SupportChatWindow';
import NewThreadModal from './NewThreadModal';
import ArtistSupportView from './ArtistSupportView';

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
  rating?: number;
  release_id?: number;
  track_id?: number;
  release_title?: string;
  release_cover?: string;
  track_title?: string;
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
  const [releases, setReleases] = useState<Release[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const { toast } = useToast();

  const SUPPORT_URL = 'https://functions.poehali.dev/03b127de-537a-446c-af8d-01caba70e2e9';

  const isStaff = userRole === 'manager' || userRole === 'director';

  useEffect(() => {
    loadThreads();
    if (isStaff) {
      loadArtists();
    } else {
      loadUserReleases();
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
  
  const loadUserReleases = async () => {
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'get_user_releases'
        })
      });
      
      if (!response.ok) throw new Error('Failed to load releases');
      
      const data = await response.json();
      setReleases(data.releases || []);
      setTracks(data.tracks || []);
    } catch (error) {
      console.error('Error loading releases:', error);
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
            priority: 'normal',
            release_id: selectedRelease,
            track_id: selectedTrack
          })
        });
        
        if (!response.ok) throw new Error('Failed to create thread');
        
        const data = await response.json();
        await loadThreads();
        setActiveThread(data.thread_id);
        setSelectedRelease(null);
        setSelectedTrack(null);
        
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

  const updateThreadStatus = async (status: string) => {
    if (!activeThread) return;
    
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'update_status',
          thread_id: activeThread,
          status
        })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      await loadThreads();
      toast({
        title: 'Готово',
        description: 'Статус обновлён'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const submitRating = async (rating: number) => {
    if (!activeThread) return;
    
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'rate_thread',
          thread_id: activeThread,
          rating
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit rating');
      
      await loadThreads();
      toast({
        title: 'Спасибо!',
        description: 'Ваша оценка учтена'
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить оценку',
        variant: 'destructive'
      });
    }
  };

  const activeThreadData = threads.find(t => t.id === activeThread);

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <ArtistSupportView
        hasThread={threads.length > 0}
        threadData={activeThreadData || null}
        messages={messages}
        userId={userId}
        newMessage={newMessage}
        sendingMessage={sendingMessage}
        releases={releases}
        tracks={tracks}
        onCreateThread={(releaseId, trackId) => {
          setSelectedRelease(releaseId || null);
          setSelectedTrack(trackId || null);
          createNewThread();
        }}
        onMessageChange={setNewMessage}
        onSendMessage={sendMessage}
        onRatingSubmit={submitRating}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SupportThreadList
          threads={threads}
          activeThread={activeThread}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onThreadSelect={setActiveThread}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          onNewThreadClick={() => setShowNewThreadModal(true)}
        />

        <SupportChatWindow
          threadData={activeThreadData || null}
          messages={messages}
          userId={userId}
          newMessage={newMessage}
          sendingMessage={sendingMessage}
          isStaff={isStaff}
          onMessageChange={setNewMessage}
          onSendMessage={sendMessage}
          onStatusChange={isStaff ? updateThreadStatus : undefined}
        />
      </div>

      <NewThreadModal
        open={showNewThreadModal}
        artists={artists}
        selectedArtist={selectedArtist}
        newThreadSubject={newThreadSubject}
        newThreadMessage={newThreadMessage}
        releases={releases}
        tracks={tracks}
        selectedRelease={selectedRelease}
        selectedTrack={selectedTrack}
        isArtist={!isStaff}
        onOpenChange={setShowNewThreadModal}
        onArtistChange={setSelectedArtist}
        onSubjectChange={setNewThreadSubject}
        onMessageChange={setNewThreadMessage}
        onReleaseChange={setSelectedRelease}
        onTrackChange={setSelectedTrack}
        onCreate={createNewThread}
      />
    </>
  );
}