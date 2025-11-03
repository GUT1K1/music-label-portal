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
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
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

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    if (isToday(date)) return 'Сегодня';
    if (isTomorrow(date)) return 'Завтра';
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return 'в ' + format(date, 'EEEE', { locale: ru });
    }
    return format(date, 'd MMMM, HH:mm', { locale: ru });
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Все задачи</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
              <Icon name="Plus" size={18} className="mr-2" />
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
                      <SelectItem value="urgent">Срочный</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="low">Низкий</SelectItem>
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

      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
          size="sm"
        >
          Все ({statusCounts.all})
        </Button>
        <Button
          variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('in_progress')}
          size="sm"
        >
          В работе ({statusCounts.in_progress})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('completed')}
          size="sm"
        >
          Выполненные ({statusCounts.completed})
        </Button>
        <Button
          variant={statusFilter === 'deleted' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('deleted')}
          size="sm"
        >
          Удаленные ({statusCounts.deleted})
        </Button>
      </div>

      <div className="space-y-3">
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
                className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-all"
              >
                <div className="p-4 bg-neutral-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          #{task.id}
                        </span>
                        <Badge 
                          className={
                            task.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-300' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          }
                          variant="outline"
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <Badge 
                          className={
                            task.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          }
                          variant="outline"
                        >
                          {getStatusLabel(task.status)}
                        </Badge>
                        {ticket && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            Тикет #{task.ticket_id}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-base mb-2">
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {task.deadline && (
                          <span>
                            {formatDeadline(task.deadline)}
                          </span>
                        )}
                        {manager && (
                          <span>
                            {manager.full_name}
                          </span>
                        )}
                        {task.created_by_name && (
                          <span>
                            {task.created_by_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Icon name="Eye" size={18} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Icon name="Settings" size={18} />
                      </Button>
                    </div>
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