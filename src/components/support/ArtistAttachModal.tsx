import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface ArtistAttachModalProps {
  releases: Release[];
  tracks: Track[];
  selectedRelease: number | null;
  selectedTrack: number | null;
  onSelectRelease: (releaseId: number | null) => void;
  onSelectTrack: (trackId: number | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ArtistAttachModal({
  releases,
  tracks,
  selectedRelease,
  selectedTrack,
  onSelectRelease,
  onSelectTrack,
  onConfirm,
  onCancel
}: ArtistAttachModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="text-base">Прикрепить релиз или трек</CardTitle>
        </CardHeader>
        <div className="p-4 space-y-4">
          {releases.length === 0 && tracks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Icon name="Music" className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">У вас пока нет релизов</p>
              <p className="text-xs mt-1">Загрузите релиз, чтобы прикрепить его к обращению</p>
            </div>
          ) : (
            <>
              {releases.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Релиз (опционально)</label>
                  <Select value={selectedRelease?.toString() || ''} onValueChange={(val) => onSelectRelease(val ? Number(val) : null)}>
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
              
              {tracks.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Трек (опционально)</label>
              <Select value={selectedTrack?.toString() || ''} onValueChange={(val) => onSelectTrack(val ? Number(val) : null)}>
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
            </>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={!selectedRelease && !selectedTrack}
            >
              Прикрепить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
