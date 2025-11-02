import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SupportChatWindow from './SupportChatWindow';

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
  rating?: number;
}

interface ArtistSupportViewProps {
  hasThread: boolean;
  threadData: ThreadData | null;
  messages: Message[];
  userId: number;
  newMessage: string;
  sendingMessage: boolean;
  onCreateThread: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onRatingSubmit: (rating: number) => void;
}

export default function ArtistSupportView({
  hasThread,
  threadData,
  messages,
  userId,
  newMessage,
  sendingMessage,
  onCreateThread,
  onMessageChange,
  onSendMessage,
  onRatingSubmit
}: ArtistSupportViewProps) {
  if (!hasThread) {
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
            <Button onClick={onCreateThread} size="lg" className="gap-2">
              <Icon name="Plus" className="w-5 h-5" />
              Создать обращение
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SupportChatWindow
        threadData={threadData}
        messages={messages}
        userId={userId}
        newMessage={newMessage}
        sendingMessage={sendingMessage}
        isStaff={false}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onRatingSubmit={onRatingSubmit}
      />
    </div>
  );
}