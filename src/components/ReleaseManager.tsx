import Icon from '@/components/ui/icon';
import ModerationPanel from './releases/ModerationPanel';
import ReleaseManagerView from './releases/ReleaseManagerView';
import { useReleaseManager } from './releases/useReleaseManager';

interface ReleaseManagerProps {
  userId: number;
  userRole?: string;
  isDemoMode?: boolean;
}

export default function ReleaseManager({ userId, userRole = 'artist', isDemoMode = false }: ReleaseManagerProps) {
  
  // В демо-режиме показываем заглушку
  if (isDemoMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 border border-gold-400/20 rounded-3xl p-12">
          <Icon name="Music" size={64} className="mx-auto text-gold-400/50" />
          <h3 className="text-2xl font-bold text-white">Здесь будут ваши треки</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            После регистрации вы сможете загружать треки, управлять релизами и отслеживать их статус
          </p>
        </div>
      </div>
    );
  }
  const {
    releases,
    loading,
    uploading,
    uploadProgress,
    currentUploadFile,
    showForm,
    setShowForm,
    activeTab,
    setActiveTab,
    newRelease,
    setNewRelease,
    coverPreview,
    tracks,
    handleCoverChange,
    addTrack,
    removeTrack,
    updateTrack,
    moveTrack,
    handleBatchUpload,
    handleSubmit,
    loadTracks,
    handleReview,
    handleEdit,
    handlePitching,
    deleteRelease
  } = useReleaseManager(userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (userRole === 'manager' || userRole === 'director') {
    return (
      <ModerationPanel
        releases={releases}
        userId={userId}
        onReview={handleReview}
        loadTracks={loadTracks}
      />
    );
  }

  return (
    <ReleaseManagerView
      userId={userId}
      releases={releases}
      showForm={showForm}
      activeTab={activeTab}
      newRelease={newRelease}
      coverPreview={coverPreview}
      tracks={tracks}
      uploading={uploading}
      uploadProgress={uploadProgress}
      currentUploadFile={currentUploadFile}
      onCreateClick={() => setShowForm(true)}
      onTabChange={setActiveTab}
      onCancelForm={() => setShowForm(false)}
      onEdit={handleEdit}
      onPitching={handlePitching}
      onDelete={deleteRelease}
      onStatusChange={handleReview}
      loadTracks={loadTracks}
      userRole={userRole}
      setNewRelease={setNewRelease}
      handleCoverChange={handleCoverChange}
      addTrack={addTrack}
      removeTrack={removeTrack}
      updateTrack={updateTrack}
      moveTrack={moveTrack}
      handleBatchUpload={handleBatchUpload}
      handleSubmit={handleSubmit}
    />
  );
}