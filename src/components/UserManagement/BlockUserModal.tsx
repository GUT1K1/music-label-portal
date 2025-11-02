import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface BlockUserModalProps {
  user: User;
  blockReason: string;
  onBlockReasonChange: (reason: string) => void;
  onBlock: (permanent: boolean) => void;
  onClose: () => void;
}

export default function BlockUserModal({ 
  user, 
  blockReason, 
  onBlockReasonChange, 
  onBlock, 
  onClose 
}: BlockUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <Card className="w-full max-w-md bg-card border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Icon name="Ban" size={20} className="text-red-400" />
            Блокировка пользователя
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold text-sm">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Причина блокировки</Label>
            <Textarea 
              value={blockReason} 
              onChange={(e) => onBlockReasonChange(e.target.value)} 
              placeholder="Нарушение правил, спам, и т.д." 
              rows={3}
              className="text-sm resize-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => onBlock(true)} 
              className="flex-1 bg-red-500 hover:bg-red-600 h-10"
            >
              <Icon name="Ban" size={16} className="mr-2" />
              <span className="text-sm">Заблокировать</span>
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="h-10"
            >
              <span className="text-sm">Отмена</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
