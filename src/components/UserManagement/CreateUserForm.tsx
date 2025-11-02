import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface CreateUserFormProps {
  newUser: {
    username: string;
    full_name: string;
    role: string;
    revenue_share_percent?: number;
  };
  onNewUserChange: (user: { username: string; full_name: string; role: string; revenue_share_percent?: number }) => void;
  onCreateUser: () => void;
}

export default function CreateUserForm({ newUser, onNewUserChange, onCreateUser }: CreateUserFormProps) {
  return (
    <Card className="border-primary/20 bg-card/95 lg:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary text-base flex items-center gap-2">
          <Icon name="UserPlus" size={18} />
          Создать пользователя
        </CardTitle>
        <CardDescription className="text-xs">Добавьте в систему</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="new_username" className="text-xs">Логин</Label>
          <Input
            id="new_username"
            placeholder="username"
            value={newUser.username}
            onChange={(e) => onNewUserChange({ ...newUser, username: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new_full_name" className="text-xs">Полное имя</Label>
          <Input
            id="new_full_name"
            placeholder="Иван Иванов"
            value={newUser.full_name}
            onChange={(e) => onNewUserChange({ ...newUser, full_name: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new_role" className="text-xs">Роль</Label>
          <Select value={newUser.role} onValueChange={(val) => onNewUserChange({ ...newUser, role: val })}>
            <SelectTrigger id="new_role" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artist">🎤 Артист</SelectItem>
              <SelectItem value="manager">🎯 Менеджер</SelectItem>
              <SelectItem value="director">👑 Руководитель</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {newUser.role === 'artist' && (
          <div className="space-y-2">
            <Label htmlFor="revenue_share" className="text-xs">% артиста</Label>
            <Input
              id="revenue_share"
              type="number"
              min="0"
              max="100"
              placeholder="50"
              value={newUser.revenue_share_percent || 50}
              onChange={(e) => onNewUserChange({ ...newUser, revenue_share_percent: parseInt(e.target.value) || 50 })}
              className="h-9 text-sm"
            />
          </div>
        )}
        <Button onClick={onCreateUser} className="w-full bg-secondary hover:bg-secondary/90 h-9 text-sm">
          <Icon name="UserPlus" size={14} className="mr-2" />
          Создать (пароль: 12345)
        </Button>
      </CardContent>
    </Card>
  );
}
