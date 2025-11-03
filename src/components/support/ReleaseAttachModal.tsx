import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Release {
  id: number;
  title: string;
  cover_url?: string;
  status: string;
}

interface ReleaseAttachModalProps {
  releases: Release[];
  selectedRelease: number | null;
  onSelectRelease: (releaseId: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReleaseAttachModal({
  releases,
  selectedRelease,
  onSelectRelease,
  onConfirm,
  onCancel
}: ReleaseAttachModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="text-base">Прикрепить релиз артиста</CardTitle>
        </CardHeader>
        <div className="p-4 space-y-4">
          {releases.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Icon name="Music" className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">У артиста пока нет релизов</p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">Выберите релиз</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {releases.map(release => (
                  <button
                    key={release.id}
                    onClick={() => onSelectRelease(release.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedRelease === release.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {release.cover_url ? (
                      <img src={release.cover_url} alt={release.title} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Icon name="Music" className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{release.title}</div>
                      <div className="text-xs text-muted-foreground">{release.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={!selectedRelease}
            >
              Прикрепить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
