import { useState } from 'react';
import { Card } from '@/components/ui/card';
import NewsCard from '@/components/NewsCard';
import JobCard from '@/components/JobCard';
import NewsDialog from '@/components/NewsDialog';
import JobDialog from '@/components/JobDialog';
import { TelegramLink } from '@/components/UserProfile/TelegramLink';
import CountdownCard from '@/components/NewsView/CountdownCard';
import BalanceCard from '@/components/NewsView/BalanceCard';
import NewsTypeFilter from '@/components/NewsView/NewsTypeFilter';
import Icon from '@/components/ui/icon';
import { useNewsData } from '@/components/NewsView/useNewsData';
import { useJobsData } from '@/components/NewsView/useJobsData';
import { useCountdown } from '@/components/NewsView/useCountdown';

interface NewsViewProps {
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  telegramLinked?: boolean;
  userBalance?: number;
  onRefreshData?: () => void;
}

export default function NewsView({ userRole, userId, telegramLinked = false, userBalance = 0, onRefreshData }: NewsViewProps) {
  const [selectedType, setSelectedType] = useState<string>('update');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid' | 'masonry'>('list');
  
  const countdown = useCountdown();
  
  const {
    news,
    loading,
    editingNews,
    isCreating,
    formData,
    setIsCreating,
    setFormData,
    handleCreateNews,
    handleUpdateNews,
    startEdit,
    handleDeleteNews
  } = useNewsData(userId);

  const {
    jobs,
    editingJob,
    isCreatingJob,
    jobFormData,
    setIsCreatingJob,
    setJobFormData,
    handleSaveJob,
    handleDeleteJob,
    startJobEdit
  } = useJobsData(userId);

  const filteredNews = news.filter(item => item.type === selectedType);
  const canManage = userRole === 'director' || userRole === 'manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CountdownCard countdown={countdown} />
        <TelegramLink userId={userId} telegramLinked={telegramLinked} onUnlink={onRefreshData} />
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <NewsTypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            canManage={canManage}
            onCreateNews={() => setIsCreating(true)}
            onCreateJob={() => setIsCreatingJob(true)}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                layoutMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              title="Список"
            >
              <Icon name="List" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                layoutMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              title="Сетка"
            >
              <Icon name="Grid3x3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`p-2 rounded-lg transition-colors ${
                layoutMode === 'masonry' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              title="Мозаика"
            >
              <Icon name="LayoutGrid" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={
          layoutMode === 'list' 
            ? 'space-y-4'
            : layoutMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4'
        }>
          {selectedType === 'job' ? (
            jobs.length === 0 ? (
              <Card className="p-8 text-center text-white/50 bg-white/5 border-white/10">
                Нет активных вакансий
              </Card>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className={layoutMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}>
                  <JobCard
                    job={job}
                    userRole={userRole}
                    onEdit={startJobEdit}
                    onDelete={handleDeleteJob}
                  />
                </div>
              ))
            )
          ) : (
            filteredNews.length === 0 ? (
              <Card className="p-8 text-center text-white/50 bg-white/5 border-white/10">
                Нет новостей
              </Card>
            ) : (
              filteredNews.map((item) => (
                <div key={item.id} className={layoutMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}>
                  <NewsCard
                    item={item}
                    userRole={userRole}
                    userId={userId}
                    onEdit={startEdit}
                    onDelete={handleDeleteNews}
                  />
                </div>
              ))
            )
          )}
        </div>
      </div>

      <NewsDialog
        open={isCreating || !!editingNews}
        editingNews={editingNews}
        formData={formData}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
          }
        }}
        onFormDataChange={setFormData}
        onSave={editingNews ? handleUpdateNews : handleCreateNews}
        onCancel={() => {
          setIsCreating(false);
        }}
      />

      <JobDialog
        open={isCreatingJob || !!editingJob}
        editingJob={editingJob}
        jobFormData={jobFormData}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreatingJob(false);
          }
        }}
        onJobFormDataChange={setJobFormData}
        onSave={handleSaveJob}
        onCancel={() => {
          setIsCreatingJob(false);
        }}
      />
    </div>
  );
}