import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface PasswordChangeFormProps {
  isChangingPassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  passwordSuccess: boolean;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onChangePassword: () => void;
  onCancelPasswordChange: () => void;
  onStartPasswordChange: () => void;
}

export const PasswordChangeForm = React.memo(function PasswordChangeForm({
  isChangingPassword,
  oldPassword,
  newPassword,
  confirmPassword,
  passwordError,
  passwordSuccess,
  onOldPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
  onCancelPasswordChange,
  onStartPasswordChange
}: PasswordChangeFormProps) {
  if (!isChangingPassword) {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Icon name="Lock" size={20} className="text-primary md:size-6" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Button 
            onClick={onStartPasswordChange}
            variant="outline"
            className="w-full h-10 md:h-11 gap-2 text-sm md:text-base"
            size="lg"
          >
            <Icon name="Key" size={16} className="md:size-[18px]" />
            Изменить пароль
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Icon name="Key" size={20} className="text-primary md:size-6" />
          Изменение пароля
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Lock" size={14} className="md:size-4" />
              Текущий пароль
            </Label>
            <Input 
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => onOldPasswordChange(e.target.value)}
              placeholder="Введите текущий пароль"
              className="h-10 md:h-11 text-sm md:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Key" size={14} className="md:size-4" />
              Новый пароль
            </Label>
            <Input 
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="Введите новый пароль"
              className="h-10 md:h-11 text-sm md:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Check" size={14} className="md:size-4" />
              Подтвердите пароль
            </Label>
            <Input 
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Повторите новый пароль"
              className="h-10 md:h-11 text-sm md:text-base"
            />
          </div>
        </div>

        {passwordError && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2.5 md:p-3 rounded-lg">
            <Icon name="AlertCircle" size={16} className="md:size-[18px]" />
            <span className="text-xs md:text-sm">{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2.5 md:p-3 rounded-lg">
            <Icon name="CheckCircle" size={16} className="md:size-[18px]" />
            <span className="text-xs md:text-sm">Пароль успешно изменен!</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3 pt-2 md:pt-4">
          <Button 
            onClick={onChangePassword}
            className="flex-1 h-10 md:h-11 gap-2 text-sm md:text-base"
            size="lg"
          >
            <Icon name="Check" size={16} className="md:size-[18px]" />
            Изменить пароль
          </Button>
          <Button 
            onClick={onCancelPasswordChange}
            variant="outline"
            className="flex-1 h-10 md:h-11 gap-2 text-sm md:text-base"
            size="lg"
          >
            <Icon name="X" size={16} className="md:size-[18px]" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
