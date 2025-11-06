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
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: null as number | null,
    deadline: '',
    ticket_id: null as number | null,
  });

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

  const openTickets = tickets?.filter(t => t.status !== 'closed') || [];

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return !task.is_deleted;
    if (statusFilter === 'deleted') return task.is_deleted;
    return task.status === statusFilter && !task.is_deleted;
  });

  const statusCounts = {
    all: tasks.filter(t => !t.is_deleted).length,
    in_progress: tasks.filter(t => t.status === 'in_progress' && !t.is_deleted).length,
    completed: tasks.filter(t => t.status === 'completed' && !t.is_deleted).length,
    deleted: tasks.filter(t => t.is_deleted).length,
  };

  return (
    <div className="space-y-4 p-3 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-primary">Все задачи</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {statusCounts.all} активных задач
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-medium ${showCreateForm ? 'opacity-75' : ''}`}
        >
          <Icon name={showCreateForm ? "X" : "Plus"} size={18} className="mr-2" />
          {showCreateForm ? 'Закрыть' : 'Создать задачу'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="p-4 md:p-6 bg-card/80 border-primary/30 animate-fadeIn">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Plus" size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Новая задача</h3>
            </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Название задачи *</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Краткое название задачи"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Описание</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Подробное описание задачи"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Выберите менеджера" />
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Дедлайн</label>
                <Input
                  type="datetime-local"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    assigned_to: null,
                    deadline: '',
                    ticket_id: null,
                  });
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleCreateTask} 
                disabled={!newTask.title}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                Создать задачу
              </Button>
            </div>
          </div>
        </Card>
      )}

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

      <div className="space-y-3">
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
              className={`p-4 md:p-5 bg-card/60 border-border hover:bg-card/80 transition-all cursor-pointer group ${
                task.is_deleted ? 'opacity-60' : ''
              }`}
              onClick={() => {
                setSelectedTask(task);
                setIsDetailDialogOpen(true);
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground font-mono">#{task.id}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {task.deadline && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>{formatDeadline(task.deadline)}</span>
                      </div>
                    )}
                    {task.assigned_name && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Icon name="User" size={14} />
                        <span>{task.assigned_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col items-start gap-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onUpdateStatus={onUpdateTaskStatus}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  );
});

export default TasksTab;