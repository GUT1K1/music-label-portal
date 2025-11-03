import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const SUPPORT_URL = 'https://functions.poehali.dev/03b127de-537a-446c-af8d-01caba70e2e9';

const UPLOAD_URL = 'https://functions.poehali.dev/4a51bf1f-9fb3-4d61-b2d4-e3c42bcb2dda';

export function useSupportActions(
  userId: number,
  isStaff: boolean,
  loadThreads: () => Promise<any[]>,
  loadMessages: (threadId: number) => Promise<void>
) {
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    activeThread: number, 
    newMessage: string, 
    setNewMessage: (msg: string) => void,
    file?: File | null,
    releaseId?: number | null
  ) => {
    if (!newMessage.trim() && !file && !releaseId) return;
    if (!activeThread) return;
    
    setSendingMessage(true);
    try {
      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;
      let messageType = 'text';
      
      if (file) {
        const uploadRes = await fetch(`${UPLOAD_URL}?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
        const uploadData = await uploadRes.json();
        
        await fetch(uploadData.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
        
        attachmentUrl = uploadData.url;
        attachmentName = file.name;
        messageType = file.type.startsWith('image/') ? 'image' : 'file';
      }
      
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'send_message',
          thread_id: activeThread,
          message: newMessage.trim() || (releaseId ? 'Прикреплён релиз' : 'Файл'),
          message_type: messageType,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
          release_id: releaseId
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

  const createNewThread = async (
    selectedArtist: number | null,
    newThreadSubject: string,
    newThreadMessage: string,
    selectedRelease: number | null,
    selectedTrack: number | null,
    setActiveThread: (id: number) => void,
    setSelectedRelease: (id: number | null) => void,
    setSelectedTrack: (id: number | null) => void
  ) => {
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

  const updateThreadStatus = async (activeThread: number, status: string) => {
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

  const attachRelease = async (
    activeThread: number,
    releaseId: number | null,
    trackId: number | null
  ) => {
    if (!activeThread) return;
    
    try {
      const response = await fetch(SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'attach_release',
          thread_id: activeThread,
          release_id: releaseId,
          track_id: trackId
        })
      });
      
      if (!response.ok) throw new Error('Failed to attach release');
      
      await loadThreads();
      await loadMessages(activeThread);
      
      toast({
        title: 'Готово',
        description: 'Релиз прикреплён к обращению'
      });
    } catch (error) {
      console.error('Error attaching release:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось прикрепить релиз',
        variant: 'destructive'
      });
    }
  };

  const submitRating = async (activeThread: number, rating: number) => {
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

  return {
    sendingMessage,
    sendMessage,
    createNewThread,
    updateThreadStatus,
    attachRelease,
    submitRating
  };
}