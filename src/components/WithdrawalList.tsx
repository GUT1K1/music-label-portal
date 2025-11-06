import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface WithdrawalRequest {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_method: 'card' | 'phone';
  payment_details: string;
  comment: string;
  created_at: string;
  processed_at?: string;
  processed_by?: number;
  rejection_reason?: string;
  artist_name?: string;
  artist_username?: string;
  processor_name?: string;
}

interface WithdrawalListProps {
  userId: number;
  userRole: 'director' | 'artist';
}

export default function WithdrawalList({ userId, userRole }: WithdrawalListProps) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, [userId]);

  const loadRequests = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WITHDRAWAL, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Load requests error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить запросы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!confirm('Подтвердить вывод средств?')) return;

    setProcessingId(requestId);
    try {
      const response = await fetch(`${API_ENDPOINTS.WITHDRAWAL}?id=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({ action: 'approve' })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve');
      }

      toast({
        title: '✅ Запрос одобрен',
        description: 'Средства списаны с баланса артиста'
      });

      loadRequests();
    } catch (error: any) {
      console.error('Approve error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось одобрить запрос',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setProcessingId(selectedRequest.id);
    try {
      const response = await fetch(`${API_ENDPOINTS.WITHDRAWAL}?id=${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          action: 'reject',
          rejection_reason: rejectionReason.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject');
      }

      toast({
        title: 'Запрос отклонен',
        description: 'Артист получит уведомление'
      });

      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
      loadRequests();
    } catch (error: any) {
      console.error('Reject error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отклонить запрос',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Ожидает</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Одобрен</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Отклонен</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Загрузка...</div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6 p-3 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-primary">
          {userRole === 'director' ? 'Запросы на вывод средств' : 'Мои запросы'}
        </h2>
        <Button onClick={loadRequests} variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-500">Ожидают обработки</h3>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-4 md:p-6 bg-card/60 border-yellow-500/30">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {userRole === 'director' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="User" size={16} className="text-primary" />
                        <span className="font-semibold">{request.artist_name || request.artist_username}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon name="Wallet" size={20} className="text-primary" />
                      <span className="text-2xl font-bold">{request.amount.toFixed(2)} ₽</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Способ:</span>{' '}
                    <span className="font-medium">
                      {request.payment_method === 'card' ? 'Банковская карта' : 'Номер телефона'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Реквизиты:</span>{' '}
                    <span className="font-mono">{request.payment_details}</span>
                  </div>
                </div>

                {request.comment && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Комментарий:</span>{' '}
                    <p className="mt-1 text-white/80">{request.comment}</p>
                  </div>
                )}

                {userRole === 'director' && request.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Одобрить
                    </Button>
                    <Button
                      onClick={() => openRejectDialog(request)}
                      disabled={processingId === request.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отклонить
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/70">История</h3>
          {processedRequests.map((request) => (
            <Card key={request.id} className="p-4 md:p-6 bg-card/40 border-white/10">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {userRole === 'director' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="User" size={16} className="text-primary" />
                        <span className="font-semibold">{request.artist_name || request.artist_username}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{request.amount.toFixed(2)} ₽</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Создан: {formatDate(request.created_at)}
                    </p>
                    {request.processed_at && (
                      <p className="text-sm text-muted-foreground">
                        Обработан: {formatDate(request.processed_at)}
                        {request.processor_name && ` (${request.processor_name})`}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {request.rejection_reason && (
                  <div className="text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <span className="text-red-400 font-medium">Причина отклонения:</span>
                    <p className="mt-1 text-white/80">{request.rejection_reason}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <Card className="p-8 text-center text-white/50 bg-white/5 border-white/10">
          Нет запросов на вывод
        </Card>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить запрос на вывод</DialogTitle>
            <DialogDescription>
              Укажите причину отклонения (необязательно)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Причина отклонения..."
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
                disabled={processingId !== null}
              >
                Отклонить запрос
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
