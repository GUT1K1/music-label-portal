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
import { useNewsData } from '@/components/NewsView/useNewsData';
import { useJobsData } from '@/components/NewsView/useJobsData';
import { useCountdown } from '@/components/NewsView/useCountdown';

interface NewsViewProps {
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  telegramLinked?: boolean;
  userBalance?: number;
}

export default function NewsView({ userRole, userId, telegramLinked = false, userBalance = 0 }: NewsViewProps) {
  const [selectedType, setSelectedType] = useState<string>('update');
  
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <CountdownCard countdown={countdown} />
        <BalanceCard balance={userBalance} />
        <TelegramLink userId={userId} telegramLinked={telegramLinked} />
      </div>

      <div className="space-y-3 md:space-y-4">
        <NewsTypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          canManage={canManage}
          onCreateNews={() => setIsCreating(true)}
          onCreateJob={() => setIsCreatingJob(true)}
        />

        <div className="space-y-4">
          {selectedType === 'job' ? (
            jobs.length === 0 ? (
              <Card className="p-8 text-center text-white/50 bg-white/5 border-white/10">
                Нет активных вакансий
              </Card>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  userRole={userRole}
                  onEdit={startJobEdit}
                  onDelete={handleDeleteJob}
                />
              ))
            )
          ) : (
            filteredNews.length === 0 ? (
              <Card className="p-8 text-center text-white/50 bg-white/5 border-white/10">
                Нет новостей
              </Card>
            ) : (
              filteredNews.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  userRole={userRole}
                  userId={userId}
                  onEdit={startEdit}
                  onDelete={handleDeleteNews}
                />
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
