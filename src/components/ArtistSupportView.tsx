import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SupportChatWindow from './SupportChatWindow';
import NewThreadModal from './NewThreadModal';

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

interface ArtistSupportViewProps {
  hasThread: boolean;
  threadData: ThreadData | null;
  messages: Message[];
  userId: number;
  newMessage: string;
  sendingMessage: boolean;
  releases?: Release[];
  tracks?: Track[];
  onCreateThread: (releaseId?: number | null, trackId?: number | null) => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onRatingSubmit: (rating: number) => void;
  onAttachRelease?: (releaseId: number | null, trackId: number | null) => void;
}

export default function ArtistSupportView({
  hasThread,
  threadData,
  messages,
  userId,
  newMessage,
  sendingMessage,
  releases = [],
  tracks = [],
  onCreateThread,
  onMessageChange,
  onSendMessage,
  onRatingSubmit,
  onAttachRelease
}: ArtistSupportViewProps) {
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  
  const handleCreateThread = () => {
    onCreateThread(selectedRelease, selectedTrack);
    setShowNewThreadModal(false);
    setSelectedRelease(null);
    setSelectedTrack(null);
  };
  if (!hasThread) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Loader2" className="w-10 h-10 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Загрузка диалога с поддержкой</h3>
            <p className="text-muted-foreground">
              Подождите, создаём ваш диалог с техподдержкой...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <SupportChatWindow
          threadData={threadData}
          messages={messages}
          userId={userId}
          newMessage={newMessage}
          sendingMessage={sendingMessage}
          isStaff={false}
          releases={releases}
          tracks={tracks}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onRatingSubmit={onRatingSubmit}
          onAttachRelease={onAttachRelease}
        />
      </div>
      
      <NewThreadModal
        open={showNewThreadModal}
        artists={[]}
        selectedArtist={null}
        newThreadSubject=""
        newThreadMessage=""
        releases={releases}
        tracks={tracks}
        selectedRelease={selectedRelease}
        selectedTrack={selectedTrack}
        isArtist={true}
        onOpenChange={setShowNewThreadModal}
        onArtistChange={() => {}}
        onSubjectChange={() => {}}
        onMessageChange={() => {}}
        onReleaseChange={setSelectedRelease}
        onTrackChange={setSelectedTrack}
        onCreate={handleCreateThread}
      />
    </>
  );
}