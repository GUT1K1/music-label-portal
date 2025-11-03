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
  release_id?: number;
  release_title?: string;
  release_cover?: string;
  sender_name?: string;
  sender_role?: string;
}

interface ThreadData {
  with_user_name?: string;
  with_user_avatar?: string;
}

interface ChatMessageProps {
  message: Message;
  userId: number;
  isStaff: boolean;
  threadData: ThreadData;
}

export default function ChatMessage({ message: msg, userId, isStaff, threadData }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
    >
      {msg.sender_id !== userId && (
        <Avatar className="w-7 h-7 shrink-0">
          {isStaff ? (
            <>
              <AvatarImage src={threadData.with_user_avatar} />
              <AvatarFallback className="bg-primary/10 text-xs">
                {threadData.with_user_name?.[0] || '?'}
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
        <div className="space-y-1">
          {msg.message_type === 'image' && msg.attachment_url && (
            <div className="rounded-lg overflow-hidden">
              <img src={msg.attachment_url} alt={msg.attachment_name || 'Изображение'} className="max-w-full h-auto" />
            </div>
          )}
          {msg.message_type === 'file' && msg.attachment_url && (
            <a
              href={msg.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                msg.sender_id === userId ? 'border-white/20 bg-white/10' : 'border-border bg-background'
              }`}
            >
              <Icon name="FileText" className="w-4 h-4" />
              <span className="text-xs flex-1 truncate">{msg.attachment_name || 'Файл'}</span>
              <Icon name="Download" className="w-3 h-3" />
            </a>
          )}
          {msg.release_id && msg.release_title && (
            <div
              className={`flex items-center gap-2 p-2 rounded-lg ${
                msg.sender_id === userId 
                  ? 'bg-white/10 border border-white/20' 
                  : 'bg-background border border-border'
              }`}
            >
              {msg.release_cover ? (
                <img src={msg.release_cover} alt={msg.release_title} className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <Icon name="Music" className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{msg.release_title}</div>
                <div className="text-[10px] opacity-70">Релиз</div>
              </div>
            </div>
          )}
          {msg.message && (
            <div
              className={`rounded-2xl px-3 py-1.5 ${
                msg.sender_id === userId
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm'
                  : 'bg-muted'
              }`}
            >
              <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 px-2">
          {format(new Date(msg.created_at), 'd MMM, HH:mm', { locale: ru })}
        </p>
      </div>
    </div>
  );
}
