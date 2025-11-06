import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Task } from '@/components/useTasks';
import TaskDetailDialog from '@/components/TaskDetailDialog';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TasksTabProps {
  tasks: Task[];
  tickets?: any[];
  managers: any[];
  onCreateTask: (task: any) => Promise<boolean>;
  onUpdateTaskStatus: (taskId: number, status: string, completionReport?: string, completionFile?: File) => Promise<boolean>;
  onDeleteTask: (taskId: number) => Promise<boolean>;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
}

const TasksTab = React.memo(function TasksTab({
  tasks,
  tickets = [],
  managers,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
  showDeleted = false,
  onToggleDeleted
}: TasksTabProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'created'>('priority');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: null as number | null,
    deadline: '',
    ticket_id: null as number | null,
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleCreateTask = async () => {
    const success = await onCreateTask({ ...newTask, status: 'in_progress' });
    if (success) {
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: null,
        deadline: '',
        ticket_id: null,
      });
      setAttachedFile(null);
      setShowCreateForm(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Срочный</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Высокий</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Средний</Badge>;
      case 'low':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Низкий</Badge>;
      default:
        return <Badge variant="outline">Средний</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Выполнено</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">В работе</Badge>;
      case 'open':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Открыто</Badge>;
      default:
        return <Badge variant="outline">Открыто</Badge>;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    if (isToday(date)) return 'Сегодня';
    if (isTomorrow(date)) return 'Завтра';
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'EEEE', { locale: ru });
    }
    return format(date, 'd MMM, HH:mm', { locale: ru });
  };

  const getTimeRemaining = (deadline: string, status: string) => {
    if (status === 'completed') return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      const hours = Math.floor(absDiff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) return { text: `Просрочено ${days}д`, isOverdue: true };
      return { text: `Просрочено ${hours}ч`, isOverdue: true };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return { text: `${days}д ${hours % 24}ч`, isOverdue: false };
    if (hours > 0) return { text: `${hours}ч`, isOverdue: false };
    return { text: `<1ч`, isOverdue: false };
  };

  const openTickets = tickets?.filter(t => t.status !== 'closed') || [];

  const filteredTasks = tasks
    .filter(task => {
      if (statusFilter === 'all') return !task.is_deleted;
      if (statusFilter === 'deleted') return task.is_deleted;
      return task.status === statusFilter && !task.is_deleted;
    })
    .sort((a, b) => {
      const aCompleted = a.status === 'completed';
      const bCompleted = b.status === 'completed';
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return b.id - a.id;
    });

  const statusCounts = {
    all: tasks.filter(t => !t.is_deleted).length,
    in_progress: tasks.filter(t => t.status === 'in_progress' && !t.is_deleted).length,
    completed: tasks.filter(t => t.status === 'completed' && !t.is_deleted).length,
    deleted: tasks.filter(t => t.is_deleted).length,
  };

  return (
    <div className="p-3 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary">Все задачи</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {statusCounts.all} активных задач
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card className="p-4 md:p-6 bg-card/80 border-primary/30 sticky top-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Plus" size={24} className="text-primary" />
                <h3 className="text-lg font-semibold">Новая задача</h3>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Название *</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Краткое название"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Описание</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Подробности"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Приоритет</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">🔴 Срочный</SelectItem>
                    <SelectItem value="high">🟠 Высокий</SelectItem>
                    <SelectItem value="medium">🟡 Средний</SelectItem>
                    <SelectItem value="low">🟢 Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Менеджер</label>
                <Select
                  value={newTask.assigned_to?.toString() || ''}
                  onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value ? parseInt(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        {manager.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Дедлайн</label>
                <Input
                  type="datetime-local"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Файл (необязательно)</label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {attachedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 p-2 rounded">
                      <Icon name="Paperclip" size={14} />
                      <span className="truncate">{attachedFile.name}</span>
                      <button
                        onClick={() => setAttachedFile(null)}
                        className="ml-auto text-red-400 hover:text-red-300"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleCreateTask} 
                disabled={!newTask.title}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать задачу
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
                className="gap-2"
              >
                Все ({statusCounts.all})
              </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('in_progress')}
              size="sm"
              className="gap-2"
            >
              <Icon name="Clock" size={14} />
              В работе ({statusCounts.in_progress})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('completed')}
              size="sm"
              className="gap-2"
            >
              <Icon name="CheckCircle2" size={14} />
              Выполнено ({statusCounts.completed})
            </Button>
              {statusCounts.deleted > 0 && (
                <Button
                  variant={statusFilter === 'deleted' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('deleted')}
                  size="sm"
                  className="gap-2"
                >
                  <Icon name="Trash2" size={14} />
                  Удалённые ({statusCounts.deleted})
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Сортировка:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">По приоритету</SelectItem>
                  <SelectItem value="deadline">По дедлайну</SelectItem>
                  <SelectItem value="created">По дате</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <Card className="p-8 text-center bg-card/40 border-white/10">
                <Icon name="ListTodo" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {statusFilter === 'all' ? 'Нет активных задач' : 'Нет задач в этой категории'}
                </p>
              </Card>
            ) : (
              filteredTasks.map(task => (
                <Card 
                  key={task.id} 
                  className={`p-3 bg-card/60 border-border hover:bg-card/80 transition-all cursor-pointer group ${
                    task.is_deleted ? 'opacity-60' : ''
                  }`}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailDialogOpen(true);
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono shrink-0">#{task.id}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {task.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {task.deadline && (() => {
                          const timeLeft = getTimeRemaining(task.deadline, task.status);
                          if (!timeLeft) return null;
                          return (
                            <div className={`flex items-center gap-1 text-xs ${
                              timeLeft.isOverdue ? 'text-red-400' : 'text-muted-foreground'
                            }`}>
                              <Icon name="Clock" size={12} />
                              <span className="hidden sm:inline">{timeLeft.text}</span>
                            </div>
                          );
                        })()}
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.created_at && (
                        <div className="flex items-center gap-1">
                          <Icon name="CalendarPlus" size={11} />
                          <span>{format(new Date(task.created_at), 'd MMM, HH:mm', { locale: ru })}</span>
                        </div>
                      )}
                      {(task.assignee_name || task.assigned_name) && (
                        <div className="flex items-center gap-1">
                          <Icon name="UserCheck" size={11} />
                          <span className="truncate max-w-[120px]">{task.assignee_name || task.assigned_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onUpdateStatus={onUpdateTaskStatus}
          onDeleteTask={onDeleteTask}
          userRole="director"
        />
      )}
    </div>
  );
});

export default TasksTab;