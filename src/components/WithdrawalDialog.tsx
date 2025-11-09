import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  currentBalance: number;
  onSuccess?: () => void;
}

export default function WithdrawalDialog({ 
  open, 
  onOpenChange, 
  userId, 
  currentBalance,
  onSuccess 
}: WithdrawalDialogProps) {
  const { toast } = useToast();
  const balance = currentBalance || 0;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'card',
    payment_details: '',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount < 1000) {
      toast({
        title: 'Ошибка',
        description: 'Минимальная сумма вывода 1000₽',
        variant: 'destructive'
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: 'Ошибка',
        description: 'Сумма превышает доступный баланс',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.payment_details.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Укажите реквизиты для вывода',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.WITHDRAWAL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          amount,
          payment_method: formData.payment_method,
          payment_details: formData.payment_details.trim(),
          comment: formData.comment.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create withdrawal request');
      }

      toast({
        title: '✅ Запрос создан',
        description: 'Ваш запрос на вывод средств отправлен руководителю'
      });

      setFormData({
        amount: '',
        payment_method: 'card',
        payment_details: '',
        comment: ''
      });
      
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Withdrawal request error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать запрос',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Wallet" size={24} className="text-primary" />
            Запрос на вывод средств
          </DialogTitle>
          <DialogDescription>
            Доступно к выводу: <span className="text-primary font-bold">{balance.toFixed(2)} ₽</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма вывода (минимум 1000₽)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1000"
              max={balance}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Введите сумму"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Способ вывода</Label>
            <RadioGroup
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">Банковская карта</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="cursor-pointer">Номер телефона</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_details">
              {formData.payment_method === 'card' ? 'Номер карты' : 'Номер телефона'}
            </Label>
            <Input
              id="payment_details"
              type="text"
              value={formData.payment_details}
              onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
              placeholder={formData.payment_method === 'card' ? '1234 5678 9012 3456' : '+7 900 123-45-67'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Дополнительная информация"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Отправить запрос'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}