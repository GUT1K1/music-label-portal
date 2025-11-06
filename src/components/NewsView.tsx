import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import NewsCard from '@/components/NewsCard';
import JobCard from '@/components/JobCard';
import NewsDialog from '@/components/NewsDialog';
import JobDialog from '@/components/JobDialog';
import { TelegramLink } from '@/components/UserProfile/TelegramLink';

interface News {
  id: number;
  title: string;
  content: string;
  type: 'update' | 'faq' | 'job';
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

interface Job {
  id: number;
  position: string;
  schedule: string;
  workplace: string;
  duties: string;
  salary: string;
  contact: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

interface NewsViewProps {
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  telegramLinked?: boolean;
}

export default function NewsView({ userRole, userId, telegramLinked = false }: NewsViewProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedType, setSelectedType] = useState<string>('update');
  const { toast } = useToast();
  
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'update' as 'update' | 'faq' | 'job',
    priority: 0,
    is_active: true,
    image_url: '',
    poll: undefined as { question: string; options: string[] } | undefined
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    position: '',
    schedule: '',
    workplace: '',
    duties: '',
    salary: '',
    contact: '',
    is_active: true
  });

  const loadJobs = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/57ba52aa-ffc4-4822-b9ee-d1847947bc41');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить новости',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCountdown = () => {
    const reportDates = [
      new Date(new Date().getFullYear(), 3, 30),
      new Date(new Date().getFullYear(), 5, 30),
      new Date(new Date().getFullYear(), 9, 30),
      new Date(new Date().getFullYear() + 1, 1, 28)
    ];
    
    const now = new Date();
    const nextReport = reportDates.find(date => date > now) || reportDates[0];
    
    const diff = nextReport.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setCountdown({ days, hours, minutes, seconds });
  };

  useEffect(() => {
    loadNews();
    loadJobs();
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create news');

      toast({
        title: 'Успешно',
        description: 'Новость создана'
      });

      setIsCreating(false);
      setFormData({ title: '', content: '', type: 'update', priority: 0, is_active: true, image_url: '', poll: undefined });
      loadNews();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать новость',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateNews = async () => {
    if (!editingNews) return;

    try {
      const response = await fetch('https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({ ...formData, id: editingNews.id })
      });

      if (!response.ok) throw new Error('Failed to update news');

      toast({
        title: 'Успешно',
        description: 'Новость обновлена'
      });

      setEditingNews(null);
      setFormData({ title: '', content: '', type: 'update', priority: 0, is_active: true, image_url: '', poll: undefined });
      loadNews();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить новость',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (item: News) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      priority: item.priority,
      is_active: item.is_active,
      image_url: '',
      poll: undefined
    });
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to delete news');

      toast({
        title: 'Успешно',
        description: 'Новость удалена'
      });

      loadNews();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить новость',
        variant: 'destructive'
      });
    }
  };

  const handleSaveJob = async () => {
    try {
      const url = editingJob 
        ? `https://functions.poehali.dev/57ba52aa-ffc4-4822-b9ee-d1847947bc41?id=${editingJob.id}`
        : 'https://functions.poehali.dev/57ba52aa-ffc4-4822-b9ee-d1847947bc41';
      
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify(jobFormData)
      });

      if (!response.ok) throw new Error('Failed to save job');

      toast({
        title: 'Успешно',
        description: editingJob ? 'Вакансия обновлена' : 'Вакансия создана'
      });

      setEditingJob(null);
      setIsCreatingJob(false);
      setJobFormData({ position: '', schedule: '', workplace: '', duties: '', salary: '', contact: '', is_active: true });
      loadJobs();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить вакансию',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту вакансию?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/57ba52aa-ffc4-4822-b9ee-d1847947bc41?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to delete job');

      toast({
        title: 'Успешно',
        description: 'Вакансия удалена'
      });

      loadJobs();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить вакансию',
        variant: 'destructive'
      });
    }
  };

  const startJobEdit = (job: Job) => {
    setEditingJob(job);
    setJobFormData({
      position: job.position,
      schedule: job.schedule,
      workplace: job.workplace,
      duties: job.duties,
      salary: job.salary,
      contact: job.contact,
      is_active: job.is_active
    });
  };

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
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg border border-primary/30">
                <Icon name="Clock" className="text-primary" size={16} />
              </div>
              <h2 className="text-xs md:text-sm font-medium text-muted-foreground">До следующего отчета</h2>
            </div>
            
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.days}</span>
                <span className="text-[10px] md:text-xs text-muted-foreground">д</span>
              </div>
              <span className="text-primary/30">•</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.hours}</span>
                <span className="text-[10px] md:text-xs text-muted-foreground">ч</span>
              </div>
              <span className="text-primary/30 hidden md:inline">•</span>
              <div className="items-baseline gap-0.5 hidden md:flex">
                <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.minutes}</span>
                <span className="text-[10px] md:text-xs text-muted-foreground">м</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <TelegramLink userId={userId} telegramLinked={telegramLinked} />

      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto">
            <Button
              variant={selectedType === 'update' ? 'default' : 'outline'}
              onClick={() => setSelectedType('update')}
              className="text-xs md:text-sm whitespace-nowrap"
              size="sm"
            >
              Обновления
            </Button>
            <Button
              variant={selectedType === 'faq' ? 'default' : 'outline'}
              onClick={() => setSelectedType('faq')}
              className="text-xs md:text-sm whitespace-nowrap"
              size="sm"
            >
              FAQ
            </Button>
            <Button
              variant={selectedType === 'job' ? 'default' : 'outline'}
              onClick={() => setSelectedType('job')}
              className="text-xs md:text-sm whitespace-nowrap"
              size="sm"
            >
              Вакансии
            </Button>
          </div>
          {canManage && (
            <div className="flex gap-2">
              {selectedType !== 'job' && (
                <Button onClick={() => setIsCreating(true)} size="sm" className="text-xs md:text-sm w-full md:w-auto">
                  <Icon name="Plus" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Создать новость
                </Button>
              )}
              {selectedType === 'job' && (
                <Button onClick={() => setIsCreatingJob(true)} variant="secondary" size="sm" className="text-xs md:text-sm w-full md:w-auto">
                  <Icon name="Plus" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Создать вакансию
                </Button>
              )}
            </div>
          )}
        </div>

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
            setEditingNews(null);
          }
        }}
        onFormDataChange={setFormData}
        onSave={editingNews ? handleUpdateNews : handleCreateNews}
        onCancel={() => {
          setIsCreating(false);
          setEditingNews(null);
        }}
      />

      <JobDialog
        open={isCreatingJob || !!editingJob}
        editingJob={editingJob}
        jobFormData={jobFormData}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreatingJob(false);
            setEditingJob(null);
          }
        }}
        onJobFormDataChange={setJobFormData}
        onSave={handleSaveJob}
        onCancel={() => {
          setIsCreatingJob(false);
          setEditingJob(null);
        }}
      />
    </div>
  );
}