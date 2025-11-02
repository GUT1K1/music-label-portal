import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
  image_url?: string;
  has_poll?: boolean;
  poll_id?: number;
}

interface PollOption {
  id: number;
  option_text: string;
  votes_count: number;
}

interface NewsCardProps {
  item: News;
  userRole: 'artist' | 'manager' | 'director';
  userId: number;
  onEdit: (item: News) => void;
  onDelete: (id: number) => void;
}

export default function NewsCard({ item, userRole, userId, onEdit, onDelete }: NewsCardProps) {
  const canEdit = userRole === 'director' || userRole === 'manager';
  const { toast } = useToast();
  
  const [pollData, setPollData] = useState<{
    poll: { id: number; question: string };
    options: PollOption[];
    user_voted: number | null;
  } | null>(null);
  const [loadingPoll, setLoadingPoll] = useState(false);
  
  useEffect(() => {
    if (item.has_poll) {
      loadPoll();
    }
  }, [item.has_poll]);
  
  const loadPoll = async () => {
    setLoadingPoll(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80?action=get_poll&news_id=${item.id}`,
        {
          headers: {
            'X-User-Id': userId.toString()
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPollData(data);
      }
    } catch (error) {
      console.error('Failed to load poll:', error);
    } finally {
      setLoadingPoll(false);
    }
  };
  
  const handleVote = async (optionId: number) => {
    if (!pollData) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/02b8e089-cfba-4460-9cad-479b3d0c5c80', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'vote',
          poll_id: pollData.poll.id,
          option_id: optionId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: 'Ошибка',
          description: error.error || 'Не удалось проголосовать',
          variant: 'destructive'
        });
        return;
      }
      
      const result = await response.json();
      setPollData({
        ...pollData,
        options: result.options,
        user_voted: optionId
      });
      
      toast({
        title: 'Успешно',
        description: 'Ваш голос учтён'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось проголосовать',
        variant: 'destructive'
      });
    }
  };
  
  const totalVotes = pollData?.options.reduce((sum, opt) => sum + opt.votes_count, 0) || 0;
  
  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <Badge variant={item.type === 'update' ? 'default' : 'secondary'}>
            {item.type === 'update' ? 'Обновление' : 'FAQ'}
          </Badge>
          {item.has_poll && (
            <Badge variant="outline" className="border-primary/50">
              <Icon name="BarChart3" className="w-3 h-3 mr-1" />
              Опрос
            </Badge>
          )}
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
            >
              <Icon name="Edit" className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
            >
              <Icon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {item.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-auto max-h-64 object-cover"
          />
        </div>
      )}
      
      <p className="text-sm text-white/70 whitespace-pre-wrap">{item.content}</p>
      
      {item.has_poll && pollData && !loadingPoll && (
        <div className="mt-4 p-4 bg-black/20 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="BarChart3" className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">{pollData.poll.question}</h4>
          </div>
          <div className="space-y-2">
            {pollData.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;
              const isVoted = pollData.user_voted === option.id;
              const hasVoted = pollData.user_voted !== null;
              
              return (
                <div key={option.id} className="space-y-1">
                  <Button
                    variant={isVoted ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleVote(option.id)}
                    disabled={hasVoted}
                  >
                    <span className="flex-1 text-left">{option.option_text}</span>
                    {hasVoted && (
                      <span className="text-xs ml-2">
                        {option.votes_count} ({percentage.toFixed(0)}%)
                      </span>
                    )}
                  </Button>
                  {hasVoted && (
                    <Progress value={percentage} className="h-1" />
                  )}
                </div>
              );
            })}
          </div>
          {totalVotes > 0 && (
            <p className="text-xs text-white/50 mt-3">
              Всего голосов: {totalVotes}
            </p>
          )}
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between text-xs text-white/50">
        <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
        {!item.is_active && <Badge variant="outline">Неактивна</Badge>}
      </div>
    </Card>
  );
}
