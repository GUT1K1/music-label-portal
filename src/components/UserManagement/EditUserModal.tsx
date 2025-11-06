import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface EditUserModalProps {
  user: User;
  editData: Partial<User>;
  onEditDataChange: (data: Partial<User>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function EditUserModal({ 
  user, 
  editData, 
  onEditDataChange, 
  onSave, 
  onClose 
}: EditUserModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    const dataToSave = { ...editData };
    if (newPassword.trim()) {
      (dataToSave as any).new_password = newPassword;
    }
    onEditDataChange(dataToSave);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-card border-blue-500/30 my-4 max-h-[95vh] overflow-y-auto">
        <CardHeader className="pb-3 sticky top-0 bg-card z-10 border-b">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Icon name="UserCog" size={20} className="text-blue-400" />
            Редактирование пользователя
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            <span>{user.full_name}</span>
            {user.created_at && (
              <span className="text-muted-foreground">• Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Icon name="Image" size={16} />
              Аватар
            </h3>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarImage src={editData.avatar || user.avatar || user.vk_photo || undefined} alt={user.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-lg font-bold">
                  {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label className="text-sm">URL аватара</Label>
                <Input
                  value={editData.avatar || ''}
                  onChange={(e) => onEditDataChange({ ...editData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="h-10"
                />
                {user.vk_photo && (
                  <p className="text-xs text-muted-foreground">VK фото: {user.vk_photo}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Icon name="User" size={16} />
              Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">Полное имя</Label>
                <Input
                  value={editData.full_name || ''}
                  onChange={(e) => onEditDataChange({ ...editData, full_name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Логин</Label>
                <Input
                  value={editData.username || ''}
                  onChange={(e) => onEditDataChange({ ...editData, username: e.target.value })}
                  placeholder="username"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => onEditDataChange({ ...editData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="h-10"
                />
                {user.vk_email && (
                  <p className="text-xs text-muted-foreground">VK Email: {user.vk_email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Роль</Label>
                <Select 
                  value={editData.role || user.role} 
                  onValueChange={(val) => onEditDataChange({ ...editData, role: val as 'artist' | 'manager' | 'director' })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artist">🎤 Артист</SelectItem>
                    <SelectItem value="manager">🎯 Менеджер</SelectItem>
                    <SelectItem value="director">👑 Руководитель</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {(editData.role === 'artist' || user.role === 'artist') && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Icon name="Music" size={16} />
                Артист информация
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">% артиста от дохода</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editData.revenue_share_percent || 50}
                    onChange={(e) => onEditDataChange({ ...editData, revenue_share_percent: parseInt(e.target.value) || 50 })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Яндекс.Музыка URL</Label>
                  <Input
                    value={editData.yandex_music_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, yandex_music_url: e.target.value })}
                    placeholder="https://music.yandex.ru/artist/..."
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">VK группа URL</Label>
                  <Input
                    value={editData.vk_group_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, vk_group_url: e.target.value })}
                    placeholder="https://vk.com/..."
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">TikTok URL</Label>
                  <Input
                    value={editData.tiktok_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, tiktok_url: e.target.value })}
                    placeholder="https://www.tiktok.com/@..."
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Icon name="Lock" size={16} />
              Безопасность
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Icon name="Key" size={14} />
                  Новый пароль (оставьте пустым, чтобы не менять)
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    className="h-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                  </Button>
                </div>
                {user.password_hash && (
                  <p className="text-xs text-muted-foreground font-mono truncate">Текущий хеш: {user.password_hash.slice(0, 40)}...</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Email подтверждён</p>
                  <Badge variant={user.email_verified ? "default" : "secondary"} className="text-xs">
                    {user.email_verified ? "✓ Да" : "✗ Нет"}
                  </Badge>
                </div>
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">2FA</p>
                  <Badge variant={user.two_factor_enabled ? "default" : "secondary"} className="text-xs">
                    {user.two_factor_enabled ? "✓ Включена" : "✗ Выключена"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Icon name="Wallet" size={16} />
              Финансы
            </h3>
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Icon name="Wallet" size={16} className="text-primary" />
                Баланс (₽)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editData.balance || 0}
                onChange={(e) => onEditDataChange({ ...editData, balance: parseFloat(e.target.value) || 0 })}
                className="h-10"
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Текущий баланс пользователя</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Icon name="Info" size={16} />
              Дополнительная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {user.telegram_id && (
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Telegram</p>
                  <div className="flex items-center gap-2">
                    <Icon name="Send" size={14} className="text-blue-500" />
                    <span className="font-mono text-xs">{user.telegram_username ? `@${user.telegram_username}` : user.telegram_id}</span>
                  </div>
                  {user.telegram_first_name && (
                    <p className="text-xs">{user.telegram_first_name} {user.telegram_last_name}</p>
                  )}
                </div>
              )}
              {user.vk_id && (
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">VKontakte</p>
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={14} className="text-blue-600" />
                    <span className="text-xs">{user.vk_first_name} {user.vk_last_name}</span>
                  </div>
                  <p className="font-mono text-xs">ID: {user.vk_id}</p>
                </div>
              )}
              {user.last_ip && (
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Последний IP</p>
                  <p className="font-mono text-xs">{user.last_ip}</p>
                </div>
              )}
              {user.device_fingerprint && (
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Отпечаток устройства</p>
                  <p className="font-mono text-xs truncate" title={user.device_fingerprint}>
                    {user.device_fingerprint}
                  </p>
                </div>
              )}

            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 h-10"
            >
              <Icon name="Save" size={16} className="mr-2" />
              <span className="text-sm">Сохранить изменения</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-10"
            >
              <Icon name="X" size={16} className="mr-2" />
              <span className="text-sm">Отмена</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}