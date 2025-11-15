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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
      {releases.map((release) => (
        <Card key={release.id} className="overflow-hidden md:hover:shadow-md transition-shadow cursor-pointer" onClick={(e) => handleCardClick(release, e)}>
          <div className="flex md:flex-col items-start gap-2 md:gap-3 p-2 md:p-3">
            <div className="relative group flex-shrink-0 w-14 md:w-full">
              <div className="w-14 md:w-full aspect-square rounded overflow-hidden bg-muted">
                {release.cover_url ? (
                  <LazyImage
                    src={release.cover_url} 
                    alt={release.release_name} 
                    className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Icon name="Disc" size={20} className="md:w-8 md:h-8" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between gap-1.5 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs md:text-sm leading-tight line-clamp-2">{release.release_name}</h3>
                  {release.artist_name && (
                    <p className="text-muted-foreground text-[10px] md:text-xs truncate mt-0.5">{release.artist_name}</p>
                  )}
                  {release.tracks_count !== undefined && release.tracks_count > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{release.tracks_count} трек.</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(release.status)}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 text-xs mb-1 md:mb-2">
                {release.release_date && (
                  <div className="flex items-center gap-0.5 text-muted-foreground">
                    <Icon name="Calendar" size={10} className="flex-shrink-0" />
                    <span className="text-[9px] md:text-[10px]">{formatDate(release.release_date)}</span>
                  </div>
                )}
                {release.genre && release.genre !== '0' && (
                  <Badge variant="outline" className="gap-0.5 h-4 text-[9px] md:text-[10px] px-1">
                    <Icon name="Disc" size={8} className="flex-shrink-0" />
                    <span className="truncate max-w-[80px]">{release.genre}</span>
                  </Badge>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1">
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
                    className="gap-1 h-7 md:h-7 -ml-1.5 md:ml-0 text-[10px] px-2 justify-start md:justify-center md:flex-1"
                  >
                    <Icon name="FileText" size={12} className="flex-shrink-0" />
                    Договор
                  </Button>
                )}
                {release.tracks_count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRelease(expandedRelease === release.id ? null : release.id)}
                    className="gap-1 h-7 md:h-7 -ml-1.5 md:ml-0 text-[10px] px-2 justify-start md:justify-center md:flex-1"
                  >
                    <Icon name={expandedRelease === release.id ? 'ChevronUp' : 'Play'} size={12} className="flex-shrink-0" />
                    {expandedRelease === release.id ? 'Скрыть' : 'Слушать'}
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
                    className="gap-1 h-7 px-2 text-[10px] md:flex-1"
                  >
                    <Icon name="RefreshCw" size={12} className="flex-shrink-0" />
                    <span className="hidden md:inline">Исправить и подать</span>
                    <span className="md:hidden">Исправить</span>
                  </Button>
                )}
                {release.status === 'pending' && onEdit && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(release)}
                      className="gap-1 h-7 px-2 text-[10px] md:flex-1"
                    >
                      <Icon name="Edit" size={12} className="flex-shrink-0" />
                      <span className="hidden md:inline">Изменить</span>
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
                        className="gap-1 h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <Icon name="Trash2" size={12} className="flex-shrink-0" />
                        <span className="hidden md:inline">Удалить</span>
                      </Button>
                    )}
                  </>
                )}
                {release.status === 'approved' && onPitching && !userRole?.includes('manager') && !userRole?.includes('director') && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setPitchingRelease(release)}
                    className="gap-1 h-7 px-2 text-[10px] md:flex-1"
                  >
                    <Icon name="Send" size={12} className="flex-shrink-0" />
                    <span className="hidden md:inline">Питчинг</span>
                  </Button>
                )}
                {/* Договор для менеджеров */}
                {(userRole === 'manager' || userRole === 'director') && release.contract_pdf_url && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setContractDialogRelease(release)}
                    className="gap-1 h-7 md:h-7 -ml-1.5 md:ml-0 text-[10px] px-2 justify-start md:justify-center md:flex-1"
                  >
                    <Icon name="FileText" size={12} className="flex-shrink-0" />
                    <span className="hidden md:inline">Договор</span>
                    <span className="md:hidden">📄</span>
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
                <div className="mt-2 bg-destructive/10 border border-destructive/20 p-1.5 md:p-2 rounded">
                  <div className="flex items-start gap-1.5">
                    <Icon name="AlertCircle" size={12} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-destructive mb-0.5">Причина отклонения:</p>
                      <p className="text-[10px] text-foreground break-words">{release.review_comment}</p>
                      {release.reviewer_name && (
                        <p className="text-[10px] text-muted-foreground mt-1">— {release.reviewer_name}</p>
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
        <div className="col-span-full text-center py-8 md:py-16 px-4">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-muted mb-2 md:mb-4">
            <Icon name="Music" size={20} className="md:w-8 md:h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs md:text-lg">Релизов пока нет</p>
        </div>
      )}

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
    </div>
  );
});

export default ReleasesList;