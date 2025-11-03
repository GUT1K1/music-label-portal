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

interface NewThreadModalProps {
  open: boolean;
  artists: Artist[];
  selectedArtist: number | null;
  newThreadSubject: string;
  newThreadMessage: string;
  releases?: Release[];
  tracks?: Track[];
  selectedRelease?: number | null;
  selectedTrack?: number | null;
  isArtist?: boolean;
  onOpenChange: (open: boolean) => void;
  onArtistChange: (artistId: number) => void;
  onSubjectChange: (subject: string) => void;
  onMessageChange: (message: string) => void;
  onReleaseChange?: (releaseId: number | null) => void;
  onTrackChange?: (trackId: number | null) => void;
  onCreate: () => void;
}

export default function NewThreadModal({
  open,
  artists,
  selectedArtist,
  newThreadSubject,
  newThreadMessage,
  releases = [],
  tracks = [],
  selectedRelease = null,
  selectedTrack = null,
  isArtist = false,
  onOpenChange,
  onArtistChange,
  onSubjectChange,
  onMessageChange,
  onReleaseChange,
  onTrackChange,
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
          {!isArtist && (
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
          )}
          
          {isArtist && releases.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Релиз (опционально)</label>
              <Select value={selectedRelease?.toString() || ''} onValueChange={(val) => onReleaseChange?.(val ? Number(val) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Не выбрано</SelectItem>
                  {releases.map(release => (
                    <SelectItem key={release.id} value={release.id.toString()}>
                      {release.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {isArtist && tracks.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Трек (опционально)</label>
              <Select value={selectedTrack?.toString() || ''} onValueChange={(val) => onTrackChange?.(val ? Number(val) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Не выбрано</SelectItem>
                  {tracks.map(track => (
                    <SelectItem key={track.id} value={track.id.toString()}>
                      {track.title} ({track.release_title})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
            <Button onClick={onCreate} disabled={!isArtist && !selectedArtist}>
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}