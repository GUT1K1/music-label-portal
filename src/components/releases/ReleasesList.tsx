import { useState, useMemo, memo, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LazyImage } from '@/components/ui/image-lazy';
import { Release, Pitching } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import ReleaseViewDialog from './ReleaseViewDialog';
import ContractViewDialog from './ContractViewDialog';

const ReleasePlayer = lazy(() => import('./ReleasePlayer'));
const PitchingForm = lazy(() => import('./PitchingForm'));

interface ReleasesListProps {
  userId: number;
  releases: Release[];
  getStatusBadge: (status: string) => JSX.Element;
  onEdit?: (release: Release) => void;
  onPitching?: (data: Pitching) => Promise<void>;
  onDelete?: (releaseId: number) => void;
  onStatusChange?: (releaseId: number, status: string, comment?: string) => void;
  loadTracks?: (releaseId: number) => Promise<any[]>;
  userRole?: string;
}

const ReleasesList = memo(function ReleasesList({ userId, releases, getStatusBadge, onEdit, onPitching, onDelete, onStatusChange, loadTracks, userRole }: ReleasesListProps) {
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);
  const [pitchingRelease, setPitchingRelease] = useState<Release | null>(null);
  const [detailsRelease, setDetailsRelease] = useState<Release | null>(null);
  const [contractDialogRelease, setContractDialogRelease] = useState<Release | null>(null);
  const [contractTracks, setContractTracks] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('releases-view-mode');
    return (saved === 'list' || saved === 'grid') ? saved : 'grid';
  });

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('releases-view-mode', mode);
  };
  
  const formatDate = useMemo(() => (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const handleCardClick = (release: Release, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, audio')) {
      return;
    }
    setDetailsRelease(release);
  };

  return (
    <div className="space-y-4">
      {/* Переключатель вида */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('grid')}
          className="gap-2"
        >
          <Icon name="Grid3x3" size={16} />
          Сетка
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('list')}
          className="gap-2"
        >
          <Icon name="List" size={16} />
          Список
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-3'}>
      {releases.map((release) => (
        <Card 
          key={release.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
          onClick={(e) => handleCardClick(release, e)}
        >
          <div className={viewMode === 'grid' ? 'flex flex-col gap-3 p-3' : 'flex items-start gap-4 p-4'}>
            <div className={viewMode === 'grid' ? 'relative group flex-shrink-0 w-full' : 'relative group flex-shrink-0 w-20 h-20'}>
              <div className={viewMode === 'grid' ? 'w-full aspect-square rounded overflow-hidden bg-muted' : 'w-20 h-20 rounded overflow-hidden bg-muted'}>
                {release.cover_url ? (
                  <LazyImage
                    src={release.cover_url} 
                    alt={release.release_name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Icon name="Disc" size={viewMode === 'grid' ? 32 : 24} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{release.release_name}</h3>
                  {release.artist_name && (
                    <p className="text-muted-foreground text-xs truncate mt-1">{release.artist_name}</p>
                  )}
                  {release.tracks_count !== undefined && release.tracks_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{release.tracks_count} трек.</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(release.status)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs mb-3">
                {release.release_date && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="Calendar" size={14} className="flex-shrink-0" />
                    <span className="text-xs">{formatDate(release.release_date)}</span>
                  </div>
                )}
                {release.genre && release.genre !== '0' && (
                  <Badge variant="outline" className="gap-1 h-5 text-xs px-2">
                    <Icon name="Disc" size={12} className="flex-shrink-0" />
                    <span className="truncate max-w-[100px]">{release.genre}</span>
                  </Badge>
                )}
              </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-1.5' : 'flex flex-wrap items-center gap-2'}>
                {release.contract_pdf_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setContractDialogRelease(release);
                      if (loadTracks) {
                        const tracks = await loadTracks(release.id);
                        setContractTracks(tracks || []);
                      }
                    }}
                    className="gap-1.5 h-8 text-xs px-3 justify-center"
                  >
                    <Icon name="FileText" size={14} className="flex-shrink-0" />
                    <span>Договор</span>
                  </Button>
                )}
                {release.tracks_count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRelease(expandedRelease === release.id ? null : release.id)}
                    className="gap-1.5 h-8 text-xs px-3 justify-center"
                  >
                    <Icon name={expandedRelease === release.id ? 'ChevronUp' : 'Play'} size={14} className="flex-shrink-0" />
                    <span>{expandedRelease === release.id ? 'Скрыть' : 'Слушать'}</span>
                  </Button>
                )}
                {release.status === 'rejected_fixable' && onStatusChange && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={async () => {
                      try {
                        await onStatusChange(release.id, 'fix_and_resubmit', '');
                      } catch (error) {
                        console.error('Failed to resubmit:', error);
                      }
                    }}
                    className="gap-1.5 h-8 px-3 text-xs"
                  >
                    <Icon name="RefreshCw" size={14} className="flex-shrink-0" />
                    <span>Исправить</span>
                  </Button>
                )}
                {release.status === 'pending' && onEdit && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(release)}
                      className="gap-1.5 h-8 px-3 text-xs"
                    >
                      <Icon name="Edit" size={14} className="flex-shrink-0" />
                      <span>Изменить</span>
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (window.confirm('Вы уверены, что хотите удалить этот релиз? Все файлы будут удалены безвозвратно.')) {
                            onDelete(release.id);
                          }
                        }}
                        className="gap-1.5 h-8 px-3 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <Icon name="Trash2" size={14} className="flex-shrink-0" />
                        <span>Удалить</span>
                      </Button>
                    )}
                  </>
                )}
                {release.status === 'approved' && onPitching && !userRole?.includes('manager') && !userRole?.includes('director') && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setPitchingRelease(release)}
                    className="gap-1.5 h-8 px-3 text-xs"
                  >
                    <Icon name="Send" size={14} className="flex-shrink-0" />
                    <span>Питчинг</span>
                  </Button>
                )}
                {(userRole === 'manager' || userRole === 'director') && release.contract_pdf_url && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setContractDialogRelease(release)}
                    className="gap-1.5 h-8 px-3 text-xs"
                  >
                    <Icon name="FileText" size={14} className="flex-shrink-0" />
                    <span>Договор</span>
                  </Button>
                )}
              </div>

              {expandedRelease === release.id && (
                <div className="mt-2">
                  <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                    <ReleasePlayer userId={userId} releaseId={release.id} />
                  </Suspense>
                </div>
              )}

              {(release.status === 'rejected' && release.review_comment) && (
                <div className="mt-3 bg-destructive/10 border border-destructive/20 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-destructive mb-1">Причина отклонения:</p>
                      <p className="text-xs text-foreground break-words">{release.review_comment}</p>
                      {release.reviewer_name && (
                        <p className="text-xs text-muted-foreground mt-1.5">— {release.reviewer_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {releases.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Icon name="Music" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">Релизов пока нет</p>
        </div>
      )}
    </div>

      {pitchingRelease && onPitching && (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <PitchingForm
            release={pitchingRelease}
            isOpen={true}
            onClose={() => setPitchingRelease(null)}
            onSubmit={onPitching}
          />
        </Suspense>
      )}

      {detailsRelease && (
        <ReleaseViewDialog
          release={detailsRelease}
          userId={userId}
          userRole={userRole}
          onClose={() => setDetailsRelease(null)}
          onStatusChange={onStatusChange}
          loadTracks={loadTracks}
        />
      )}

      {/* Диалог просмотра договора */}
      {contractDialogRelease?.contract_pdf_url && (
        <ContractViewDialog
          open={contractDialogRelease !== null}
          onOpenChange={(open) => !open && setContractDialogRelease(null)}
          contractPdfUrl={contractDialogRelease.contract_pdf_url}
          requisites={contractDialogRelease.contract_requisites}
          releaseTitle={contractDialogRelease.release_name}
          releaseDate={contractDialogRelease.release_date}
          tracks={contractTracks}
          coverUrl={contractDialogRelease.cover_url}
          signatureDataUrl={contractDialogRelease.contract_signature}
        />
      )}
  );
});

export default ReleasesList;