import { useMemo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ReleaseWizard from './ReleaseWizard';
import ReleasesList from './ReleasesList';
import ReleaseStatusTabs from './ReleaseStatusTabs';
import DraftsList from './DraftsList';
import { Release, Pitching } from './types';
import { loadDraft } from '@/utils/releaseDraft';

interface ReleaseManagerViewProps {
  userId: number;
  releases: Release[];
  showForm: boolean;
  activeTab: 'all' | 'approved' | 'pending' | 'rejected';
  editingRelease: Release | null;
  newRelease: any;
  coverPreview: string | null;
  tracks: any[];
  uploading: boolean;
  uploadProgress: number;
  currentUploadFile: string;
  onCreateClick: () => void;
  onTabChange: (tab: 'all' | 'approved' | 'pending' | 'rejected') => void;
  onCancelForm: () => void;
  onEdit: (release: Release) => void;
  onPitching?: (data: Pitching) => Promise<void>;
  onDelete?: (releaseId: number) => void;
  onStatusChange?: (releaseId: number, status: string, comment?: string) => void;
  loadTracks?: (releaseId: number) => Promise<any[]>;
  userRole?: string;
  setNewRelease: (release: any) => void;
  handleCoverChange: (file: File | null) => void;
  addTrack: () => void;
  removeTrack: (index: number) => void;
  updateTrack: (index: number, field: string, value: any) => void;
  moveTrack: (index: number, direction: 'up' | 'down') => void;
  handleBatchUpload: (files: FileList) => void;
  handleSubmit: () => void;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: any; text: string; icon: string }> = {
    pending: { variant: 'secondary', text: '⏳ На модерации', icon: 'Clock' },
    approved: { variant: 'default', text: '✅ Одобрен', icon: 'CheckCircle' },
    rejected_fixable: { variant: 'outline', text: '✏️ Отклонён (можно исправить)', icon: 'Edit' },
    rejected_final: { variant: 'destructive', text: '🚫 Отклонён окончательно', icon: 'Ban' },
    draft: { variant: 'secondary', text: '📝 Черновик', icon: 'FileEdit' }
  };
  const config = variants[status] || variants.pending;
  return (
    <Badge variant={config.variant} className="gap-0.5 text-[9px] md:text-xs h-4 md:h-auto px-1 md:px-2">
      <Icon name={config.icon} size={10} className="flex-shrink-0 md:w-3 md:h-3" />
      <span className="truncate hidden md:inline">{config.text}</span>
      <span className="md:hidden">{status === 'approved' ? '✓' : status === 'rejected_fixable' ? '✏️' : status === 'rejected_final' ? '🚫' : status === 'draft' ? '📝' : '⏳'}</span>
    </Badge>
  );
};

export default function ReleaseManagerView({
  userId,
  releases,
  showForm,
  activeTab,
  editingRelease,
  newRelease,
  coverPreview,
  tracks,
  uploading,
  uploadProgress,
  currentUploadFile,
  onCreateClick,
  onTabChange,
  onCancelForm,
  onEdit,
  onPitching,
  onDelete,
  onStatusChange,
  loadTracks,
  userRole,
  setNewRelease,
  handleCoverChange,
  addTrack,
  removeTrack,
  updateTrack,
  moveTrack,
  handleBatchUpload,
  handleSubmit
}: ReleaseManagerViewProps) {
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  // Memoize filtered releases to avoid re-filtering on every render
  const filteredReleases = useMemo(() => {
    let filtered = releases;
    if (activeTab !== 'all') {
      if (activeTab === 'rejected') {
        filtered = releases.filter(r => r.status === 'rejected_fixable' || r.status === 'rejected_final');
      } else {
        filtered = releases.filter(r => r.status === activeTab);
      }
    }
    // Сортировка по дате создания (новые сверху) - создаём копию чтобы не мутировать оригинал
    return [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [activeTab, releases]);

  // Memoize callbacks
  const handleCreateClick = useCallback(() => {
    onCreateClick();
  }, [onCreateClick]);

  const handleCancelForm = useCallback(() => {
    onCancelForm();
    setSelectedDraftId(null);
  }, [onCancelForm]);

  const handleLoadDraft = useCallback((draftId: string) => {
    const draft = loadDraft(draftId);
    if (!draft) return;

    // Заполняем форму данными из черновика
    setNewRelease(draft.newRelease);
    setSelectedDraftId(draftId);
    onCreateClick();
  }, [setNewRelease, onCreateClick]);

  return (
    <div className="space-y-2 md:space-y-4 container mx-auto px-2 md:px-4 min-h-screen">
      {!showForm && (
        <>
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-sm md:text-xl font-bold">Мои релизы</h2>
            <Button onClick={handleCreateClick} size="sm" className="gap-1 h-8 md:h-9 text-[11px] md:text-sm px-2 md:px-4">
              <Icon name="Plus" size={14} className="md:size-4" />
              <span className="hidden md:inline">Создать релиз</span>
              <span className="md:hidden">Создать</span>
            </Button>
          </div>

          <ReleaseStatusTabs 
            releases={releases}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </>
      )}

      {showForm && (
        <ReleaseWizard
          editingRelease={editingRelease}
          newRelease={newRelease}
          setNewRelease={setNewRelease}
          coverPreview={coverPreview}
          handleCoverChange={handleCoverChange}
          tracks={tracks}
          addTrack={addTrack}
          removeTrack={removeTrack}
          updateTrack={updateTrack}
          moveTrack={moveTrack}
          handleBatchUpload={handleBatchUpload}
          handleSubmit={handleSubmit}
          uploading={uploading}
          uploadProgress={uploadProgress}
          currentUploadFile={currentUploadFile}
          onCancel={handleCancelForm}
          userId={userId}
          draftId={selectedDraftId}
        />
      )}

      {!showForm && (
        <>
          <DraftsList 
            userId={userId}
            onLoadDraft={handleLoadDraft}
          />
          
          <ReleasesList
          userId={userId}
          releases={filteredReleases} 
          getStatusBadge={getStatusBadge}
          onEdit={onEdit}
          onPitching={onPitching}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          loadTracks={loadTracks}
          userRole={userRole}
        />
        </>
      )}
    </div>
  );
}