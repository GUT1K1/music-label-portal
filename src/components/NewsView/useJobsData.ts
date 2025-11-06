import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Job {
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

export interface JobFormData {
  position: string;
  schedule: string;
  workplace: string;
  duties: string;
  salary: string;
  contact: string;
  is_active: boolean;
}

export function useJobsData(userId: number) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { toast } = useToast();
  
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobFormData, setJobFormData] = useState<JobFormData>({
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

  useEffect(() => {
    loadJobs();
  }, []);

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

  return {
    jobs,
    editingJob,
    isCreatingJob,
    jobFormData,
    setIsCreatingJob,
    setJobFormData,
    handleSaveJob,
    handleDeleteJob,
    startJobEdit
  };
}
