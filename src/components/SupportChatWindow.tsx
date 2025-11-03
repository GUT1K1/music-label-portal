import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ChatHeader from './support/ChatHeader';
import ChatMessage from './support/ChatMessage';
import ChatInput from './support/ChatInput';
import ReleaseAttachModal from './support/ReleaseAttachModal';
import ArtistAttachModal from './support/ArtistAttachModal';

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  attachment_name?: string;
  release_id?: number;
  release_title?: string;
  release_cover?: string;
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
  with_user_name?: string;
  with_user_avatar?: string;
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
  onSendMessage: (file?: File | null, releaseId?: number | null) => void;
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
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowAttachModal(false);
    }
  };
  
  const handleSendWithAttachment = () => {
    if (selectedFile) {
      onSendMessage(selectedFile, null);
      setSelectedFile(null);
    } else if (selectedRelease) {
      onSendMessage(null, selectedRelease);
      setSelectedRelease(null);
      setShowReleaseModal(false);
    } else {
      onSendMessage();
    }
  };
  
  const handleAttach = () => {
    if (onAttachRelease) {
      onAttachRelease(selectedRelease, selectedTrack);
    }
    setShowAttachModal(false);
    setSelectedRelease(null);
    setSelectedTrack(null);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollAreaRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [messages]);

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
      <ChatHeader
        threadData={threadData}
        isStaff={isStaff}
        onStatusChange={onStatusChange}
        onRatingSubmit={onRatingSubmit}
      />
      <Separator />
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-2">
          {messages.map(msg => (
            <ChatMessage
              key={msg.id}
              message={msg}
              userId={userId}
              isStaff={isStaff}
              threadData={threadData}
            />
          ))}
          <div ref={scrollAreaRef} />
        </div>
      </ScrollArea>
      <Separator />
      <ChatInput
        newMessage={newMessage}
        sendingMessage={sendingMessage}
        isStaff={isStaff}
        selectedFile={selectedFile}
        onMessageChange={onMessageChange}
        onSendMessage={handleSendWithAttachment}
        onFileSelect={handleFileSelect}
        onRemoveFile={() => setSelectedFile(null)}
        onShowReleaseModal={() => setShowReleaseModal(true)}
        onShowAttachModal={!isStaff ? () => setShowAttachModal(true) : undefined}
      />
      
      {showReleaseModal && (
        <ReleaseAttachModal
          releases={releases}
          selectedRelease={selectedRelease}
          onSelectRelease={setSelectedRelease}
          onConfirm={handleSendWithAttachment}
          onCancel={() => {
            setShowReleaseModal(false);
            setSelectedRelease(null);
          }}
        />
      )}
      
      {showAttachModal && (
        <ArtistAttachModal
          releases={releases}
          tracks={tracks}
          selectedRelease={selectedRelease}
          selectedTrack={selectedTrack}
          onSelectRelease={setSelectedRelease}
          onSelectTrack={setSelectedTrack}
          onConfirm={handleAttach}
          onCancel={() => {
            setShowAttachModal(false);
            setSelectedRelease(null);
            setSelectedTrack(null);
          }}
        />
      )}
    </Card>
  );
}
