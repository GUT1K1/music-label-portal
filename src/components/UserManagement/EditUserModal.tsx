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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-card border-yellow-500/20 my-2 sm:my-4 max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        <CardHeader className="pb-3 sticky top-0 bg-card z-10 border-b border-yellow-500/10 px-3 sm:px-6 py-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Icon name="UserCog" size={18} className="text-yellow-500 flex-shrink-0" />
            <span className="truncate">Редактирование пользователя</span>
          </CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs">
            <span className="truncate">{user.full_name}</span>
            {user.created_at && (
              <span className="text-muted-foreground text-[10px] sm:text-xs">• Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-3 sm:pt-4 px-3 sm:px-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
              <Icon name="Image" size={14} className="flex-shrink-0" />
              Аватар
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-yellow-500/20 flex-shrink-0">
                <AvatarImage src={editData.avatar || user.avatar || user.vk_photo || undefined} alt={user.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-lg font-bold">
                  {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1.5">
                <Label className="text-xs sm:text-sm">URL аватара</Label>
                <Input
                  value={editData.avatar || ''}
                  onChange={(e) => onEditDataChange({ ...editData, avatar: e.target.value })}
                  placeholder="https://..."
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
                {user.vk_photo && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate" title={user.vk_photo}>VK: {user.vk_photo}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
              <Icon name="User" size={14} className="flex-shrink-0" />
              Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Полное имя</Label>
                <Input
                  value={editData.full_name || ''}
                  onChange={(e) => onEditDataChange({ ...editData, full_name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Логин</Label>
                <Input
                  value={editData.username || ''}
                  onChange={(e) => onEditDataChange({ ...editData, username: e.target.value })}
                  placeholder="username"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => onEditDataChange({ ...editData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
                {user.vk_email && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate" title={user.vk_email}>VK: {user.vk_email}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Роль</Label>
                <Select 
                  value={editData.role || user.role} 
                  onValueChange={(val) => onEditDataChange({ ...editData, role: val as 'artist' | 'manager' | 'director' })}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
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
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
                <Icon name="Music" size={14} className="flex-shrink-0" />
                Артист информация
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">% артиста от дохода</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editData.revenue_share_percent || 50}
                    onChange={(e) => onEditDataChange({ ...editData, revenue_share_percent: parseInt(e.target.value) || 50 })}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Яндекс.Музыка URL</Label>
                  <Input
                    value={editData.yandex_music_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, yandex_music_url: e.target.value })}
                    placeholder="https://music.yandex.ru/..."
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">VK группа URL</Label>
                  <Input
                    value={editData.vk_group_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, vk_group_url: e.target.value })}
                    placeholder="https://vk.com/..."
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">TikTok URL</Label>
                  <Input
                    value={editData.tiktok_url || ''}
                    onChange={(e) => onEditDataChange({ ...editData, tiktok_url: e.target.value })}
                    placeholder="https://www.tiktok.com/@..."
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
              <Icon name="Lock" size={14} className="flex-shrink-0" />
              Безопасность
            </h3>
            <div className="space-y-3">
              {user.password_hash && (
                <div className="space-y-1.5 p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-yellow-500/10">
                  <Label className="text-xs sm:text-sm flex items-center gap-1.5">
                    <Icon name="ShieldAlert" size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    Текущий пароль (SHA256)
                  </Label>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Input
                      value={user.password_hash}
                      readOnly
                      className="h-8 sm:h-9 font-mono text-[10px] sm:text-xs bg-background"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0 border-yellow-500/20"
                      onClick={() => {
                        navigator.clipboard.writeText(user.password_hash || '');
                      }}
                    >
                      <Icon name="Copy" size={12} className="sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">⚠️ Пароли зашифрованы</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm flex items-center gap-1.5">
                  <Icon name="Key" size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  Новый пароль (оставьте пустым)
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Новый пароль"
                    className="h-9 sm:h-10 pr-9 sm:pr-10 text-xs sm:text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 sm:h-10 sm:w-10 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={14} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1 p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Email</p>
                  <Badge variant={user.email_verified ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                    {user.email_verified ? "✓ Да" : "✗ Нет"}
                  </Badge>
                </div>
                <div className="space-y-1 p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">2FA</p>
                  <Badge variant={user.two_factor_enabled ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                    {user.two_factor_enabled ? "✓ Вкл" : "✗ Выкл"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
              <Icon name="Wallet" size={14} className="flex-shrink-0" />
              Финансы
            </h3>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm flex items-center gap-1.5">
                <Icon name="Wallet" size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-500 flex-shrink-0" />
                Баланс (₽)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editData.balance || 0}
                onChange={(e) => onEditDataChange({ ...editData, balance: parseFloat(e.target.value) || 0 })}
                className="h-9 sm:h-10 text-xs sm:text-sm"
                placeholder="0.00"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Текущий баланс</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
              <Icon name="Info" size={14} className="flex-shrink-0" />
              Дополнительно
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              {user.telegram_id && (
                <div className="space-y-1 p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Telegram</p>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Send" size={12} className="sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="font-mono text-[10px] sm:text-xs truncate">{user.telegram_username ? `@${user.telegram_username}` : user.telegram_id}</span>
                  </div>
                  {user.telegram_first_name && (
                    <p className="text-[10px] sm:text-xs truncate">{user.telegram_first_name} {user.telegram_last_name}</p>
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

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-3 sm:pt-4 border-t border-yellow-500/10 sticky bottom-0 bg-card pb-2 sm:pb-0">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-10 sm:h-11 border-yellow-500/20 hover:bg-yellow-500/5 text-xs sm:text-sm"
            >
              <Icon name="X" size={16} className="mr-1.5" />
              Отмена
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold h-10 sm:h-11 shadow-lg shadow-yellow-500/30 text-xs sm:text-sm"
            >
              <Icon name="Save" size={16} className="mr-1.5" />
              Сохранить изменения
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}