import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Artist {
  id: number;
  username: string;
  full_name: string;
  avatar?: string;
  vk_photo?: string;
}

interface NewThreadModalProps {
  open: boolean;
  artists: Artist[];
  selectedArtist: number | null;
  newThreadSubject: string;
  newThreadMessage: string;
  onOpenChange: (open: boolean) => void;
  onArtistChange: (artistId: number) => void;
  onSubjectChange: (subject: string) => void;
  onMessageChange: (message: string) => void;
  onCreate: () => void;
}

export default function NewThreadModal({
  open,
  artists,
  selectedArtist,
  newThreadSubject,
  newThreadMessage,
  onOpenChange,
  onArtistChange,
  onSubjectChange,
  onMessageChange,
  onCreate
}: NewThreadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Select value={selectedArtist?.toString()} onValueChange={(val) => onArtistChange(Number(val))}>
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
              onChange={(e) => onSubjectChange(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Первое сообщение</label>
            <Input
              placeholder="Здравствуйте!"
              value={newThreadMessage}
              onChange={(e) => onMessageChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={onCreate} disabled={!selectedArtist}>
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
