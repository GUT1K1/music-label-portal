import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SupportThread, Message, Artist, Release, Track } from './types';

const SUPPORT_URL = 'https://functions.poehali.dev/03b127de-537a-446c-af8d-01caba70e2e9';

export function useSupportData(
  userId: number,
  isStaff: boolean,
  statusFilter: string,
  activeThread: number | null
) {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadThreads = async () => {
    setLoading(true);
    try {
      const url = (isStaff && statusFilter !== 'all')
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
      
      return data.threads || [];
    } catch (error) {
      console.error('Error loading threads:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить историю обращений',
        variant: 'destructive'
      });
      return [];
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
      
      if (isStaff && data.artist_releases) {
        setReleases(data.artist_releases || []);
      }
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

  useEffect(() => {
    const initializeSupport = async () => {
      const loadedThreads = await loadThreads();
      
      if (!isStaff && loadedThreads.length === 0) {
        try {
          const response = await fetch(SUPPORT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': userId.toString()
            },
            body: JSON.stringify({
              action: 'create_thread',
              subject: 'Новое обращение',
              priority: 'normal'
            })
          });
          
          if (response.ok) {
            await loadThreads();
          }
        } catch (error) {
          console.error('Error auto-creating thread:', error);
        }
      }
    };
    
    initializeSupport();
    
    if (isStaff) {
      loadArtists();
    } else {
      loadUserReleases();
    }
    
    // Оптимизация: обновляем список диалогов раз в минуту только когда вкладка активна
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadThreads();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [statusFilter]);

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
      
      // Оптимизация: обновляем сообщения раз в 30 секунд только когда вкладка активна
      const interval = setInterval(() => {
        if (!document.hidden) {
          loadMessages(activeThread);
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [activeThread]);

  return {
    threads,
    messages,
    artists,
    releases,
    tracks,
    loading,
    loadThreads,
    loadMessages
  };
}