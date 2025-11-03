import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ProfileEditFormProps {
  fullName: string;
  email: string;
  isUploadingAvatar: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = React.memo(function ProfileEditForm({
  fullName,
  email,
  isUploadingAvatar,
  onFullNameChange,
  onEmailChange,
  onSave,
  onCancel
}: ProfileEditFormProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Icon name="Edit" size={20} className="text-primary md:size-6" />
          Редактирование профиля
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm md:text-base flex items-center gap-2">
              <Icon name="User" size={14} className="md:size-4" />
              Полное имя
            </Label>
            <Input 
              id="fullName"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Иван Иванов"
              className="h-10 md:h-11 text-sm md:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base flex items-center gap-2">
              <Icon name="Mail" size={14} className="md:size-4" />
              Email
            </Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="your@email.com"
              className="h-10 md:h-11 text-sm md:text-base"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-2 md:pt-4">
          <Button 
            onClick={onSave}
            className="flex-1 h-10 md:h-11 gap-2 text-sm md:text-base"
            size="lg"
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin md:size-[18px]" />
                <span className="hidden sm:inline">Загрузка...</span>
                <span className="sm:hidden">Загрузка...</span>
              </>
            ) : (
              <>
                <Icon name="Check" size={16} className="md:size-[18px]" />
                <span className="hidden sm:inline">Сохранить изменения</span>
                <span className="sm:hidden">Сохранить</span>
              </>
            )}
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-10 md:h-11 gap-2 text-sm md:text-base"
            size="lg"
            disabled={isUploadingAvatar}
          >
            <Icon name="X" size={16} className="md:size-[18px]" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});