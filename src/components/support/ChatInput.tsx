import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ChatInputProps {
  newMessage: string;
  sendingMessage: boolean;
  isStaff: boolean;
  selectedFile: File | null;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onShowReleaseModal: () => void;
  onShowAttachModal?: () => void;
}

export default function ChatInput({
  newMessage,
  sendingMessage,
  isStaff,
  selectedFile,
  onMessageChange,
  onSendMessage,
  onFileSelect,
  onRemoveFile,
  onShowReleaseModal,
  onShowAttachModal
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3 bg-muted/30">
      <div className="space-y-2">
        {selectedFile && (
          <div className="flex items-center gap-2 bg-muted p-2 rounded text-sm">
            <Icon name="Paperclip" className="w-4 h-4" />
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemoveFile}
              className="h-6 w-6 p-0"
            >
              <Icon name="X" className="w-3 h-3" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          {isStaff && (
            <>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="h-9 px-3 shrink-0"
                title="Прикрепить файл"
              >
                <Icon name="Paperclip" className="w-4 h-4" />
              </Button>
              <Button
                onClick={onShowReleaseModal}
                variant="outline"
                size="sm"
                className="h-9 px-3 shrink-0"
                title="Прикрепить релиз"
              >
                <Icon name="Music" className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={onFileSelect}
                accept="*/*"
              />
            </>
          )}
          {!isStaff && onShowAttachModal && (
            <Button
              onClick={onShowAttachModal}
              variant="outline"
              size="sm"
              className="h-9 px-3 shrink-0"
              title="Прикрепить релиз или трек"
            >
              <Icon name="Paperclip" className="w-4 h-4" />
            </Button>
          )}
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendingMessage}
            className="flex-1 h-9 text-sm"
          />
          <Button 
            size="sm"
            onClick={onSendMessage} 
            disabled={sendingMessage || (!newMessage.trim() && !selectedFile)}
            className="h-9 px-3 bg-blue-500 hover:bg-blue-600 text-white shrink-0"
          >
            {sendingMessage ? (
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="Send" className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
