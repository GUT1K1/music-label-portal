import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { getUserDrafts, loadDraft, deleteDraft } from '@/utils/releaseDraft';
import { useState, useEffect } from 'react';

interface DraftsListProps {
  userId: number;
  onLoadDraft: (draftId: string) => void;
}

const RELEASE_TYPE_LABELS = {
  'single': '🎵 Сингл',
  'maxi-single': '🎶 Макси-сингл',
  'ep': '💿 EP',
  'album': '📀 Альбом'
};

export default function DraftsList({ userId, onLoadDraft }: DraftsListProps) {
  const [drafts, setDrafts] = useState(getUserDrafts(userId));

  useEffect(() => {
    setDrafts(getUserDrafts(userId));
  }, [userId]);

  const handleDelete = (draftId: string) => {
    if (confirm('Удалить черновик? Это действие нельзя отменить.')) {
      deleteDraft(draftId);
      setDrafts(getUserDrafts(userId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  if (drafts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="FileEdit" size={18} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold">Черновики ({drafts.length})</h3>
      </div>

      <div className="grid gap-2">
        {drafts.map((draft) => (
          <Card 
            key={draft.id}
            className="border-l-4 border-l-amber-500/50 hover:border-l-amber-500 transition-all cursor-pointer group"
            onClick={() => onLoadDraft(draft.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {draft.release_name || 'Без названия'}
                    </h4>
                    {draft.releaseType && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {RELEASE_TYPE_LABELS[draft.releaseType]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Music" size={12} />
                      {draft.tracksCount} {draft.tracksCount === 1 ? 'трек' : 'треков'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {formatDate(draft.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(draft.id);
                    }}
                  >
                    <Icon name="Trash2" size={14} className="text-destructive" />
                  </Button>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
