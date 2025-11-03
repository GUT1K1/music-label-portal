import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Task } from '@/components/useTasks';
import TaskDetailDialog from '@/components/TaskDetailDialog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TasksTabProps {
  tasks: Task[];
  tickets: any[];
  managers: any[];
  onCreateTask: (task: any) => Promise<boolean>;
  onUpdateTaskStatus: (taskId: number, status: string, completionReport?: string, completionFile?: File) => Promise<boolean>;
  onDeleteTask: (taskId: number) => Promise<boolean>;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
}

const TasksTab = React.memo(function TasksTab({
  tasks,
  tickets,
  managers,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
  showDeleted = false,
  onToggleDeleted
}: TasksTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
      setIsCreateDialogOpen(false);
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Срочный';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'in_progress': return 'В работе';
      case 'open': return 'Открыто';
      default: return 'Открыто';
    }
  };

  const openTickets = tickets?.filter(t => t.status !== 'closed') || [];

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const statusCounts = {
    all: tasks.length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    open: tasks.filter(t => t.status === 'open').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Icon name="ListChecks" size={24} />
          Все задачи
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать новую задачу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новая задача</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Тикет</label>
                <Select
                  value={newTask.ticket_id?.toString() || ''}
                  onValueChange={(value) => setNewTask({ ...newTask, ticket_id: value ? parseInt(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тикет" />
                  </SelectTrigger>
                  <SelectContent>
                    {openTickets.map(ticket => (
                      <SelectItem key={ticket.id} value={ticket.id.toString()}>
                        #{ticket.id} {ticket.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Название задачи *</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Введите название"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Введите описание задачи"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Приоритет</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">🔥 Срочный</SelectItem>
                      <SelectItem value="high">⚠️ Высокий</SelectItem>
                      <SelectItem value="medium">📌 Средний</SelectItem>
                      <SelectItem value="low">📋 Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Менеджер</label>
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
                <label className="text-sm font-medium">Дедлайн</label>
                <Input
                  type="datetime-local"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title}>
                  Создать задачу
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          onClick={() => setStatusFilter('all')}
          size="sm"
          className="relative"
        >
          Все ({statusCounts.all})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'ghost'}
          onClick={() => setStatusFilter('in_progress')}
          size="sm"
        >
          В работе ({statusCounts.in_progress})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'ghost'}
          onClick={() => setStatusFilter('completed')}
          size="sm"
        >
          Выполненные ({statusCounts.completed})
        </Button>
        <Button
          variant={statusFilter === 'open' ? 'default' : 'ghost'}
          onClick={() => setStatusFilter('open')}
          size="sm"
        >
          Открытые ({statusCounts.open})
        </Button>
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Нет задач</p>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const manager = managers?.find(m => m.id === task.assigned_to);
            const ticket = tickets?.find(t => t.id === task.ticket_id);
            
            return (
              <Card
                key={task.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor: 
                    task.priority === 'urgent' ? '#ef4444' :
                    task.priority === 'high' ? '#f59e0b' :
                    task.priority === 'medium' ? '#3b82f6' : '#6b7280'
                }}
                onClick={() => {
                  setSelectedTask(task);
                  setIsDetailDialogOpen(true);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'in_progress' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {getStatusLabel(task.status)}
                      </Badge>
                      <Badge 
                        variant={
                          task.priority === 'urgent' ? 'destructive' :
                          task.priority === 'high' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      {ticket && (
                        <Badge variant="outline" className="text-xs">
                          #{task.ticket_id}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-base mb-1 truncate">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {manager && (
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={12} />
                          <span>{manager.full_name}</span>
                        </div>
                      )}
                      {task.deadline && (
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          <span>
                            {format(new Date(task.deadline), 'd MMM, HH:mm', { locale: ru })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        <span>
                          {format(new Date(task.created_at), 'd MMM, HH:mm', { locale: ru })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onUpdateStatus={onUpdateTaskStatus}
          onDelete={onDeleteTask}
          managers={managers}
        />
      )}
    </div>
  );
});

export default TasksTab;