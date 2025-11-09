import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface News {
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

export interface NewsFormData {
  title: string;
  content: string;
  type: 'update' | 'faq' | 'job';
  priority: number;
  is_active: boolean;
  image_url: string;
  poll: { question: string; options: string[] } | undefined;
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

export function useNewsData(userId: number) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    type: 'update',
    priority: 0,
    is_active: true,
    image_url: '',
    poll: undefined
  });

  const loadNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/66f994a1-bcfd-46ea-81e8-b98c339839d1');
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

  useEffect(() => {
    loadNews();
  }, []);

  const handleCreateNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/66f994a1-bcfd-46ea-81e8-b98c339839d1', {
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
      const response = await fetch('https://functions.poehali.dev/66f994a1-bcfd-46ea-81e8-b98c339839d1', {
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
      const response = await fetch(`https://functions.poehali.dev/66f994a1-bcfd-46ea-81e8-b98c339839d1?id=${id}`, {
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

  return {
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
  };
}