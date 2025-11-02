import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface FreezeUserModalProps {
  user: User;
  freezeDate: string;
  onFreezeDateChange: (date: string) => void;
  onFreeze: () => void;
  onClose: () => void;
}

export default function FreezeUserModal({ 
  user, 
  freezeDate, 
  onFreezeDateChange, 
  onFreeze, 
  onClose 
}: FreezeUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <Card className="w-full max-w-md bg-card border-yellow-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Icon name="Snowflake" size={20} className="text-yellow-400" />
            Заморозка пользователя
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold text-sm">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">До какого времени</Label>
            <Input 
              type="datetime-local" 
              value={freezeDate} 
              onChange={(e) => onFreezeDateChange(e.target.value)} 
              className="h-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={onFreeze} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 h-10"
            >
              <Icon name="Snowflake" size={16} className="mr-2" />
              <span className="text-sm">Заморозить</span>
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
