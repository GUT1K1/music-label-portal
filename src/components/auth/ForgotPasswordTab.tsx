import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ForgotPasswordTabProps {
  forgotEmail: string;
  resetCode: string;
  newPassword: string;
  resetLoading: boolean;
  showResetForm: boolean;
  setForgotEmail: (value: string) => void;
  setResetCode: (value: string) => void;
  setNewPassword: (value: string) => void;
  setShowResetForm: (value: boolean) => void;
  handleForgotPassword: () => void;
  handleResetPassword: () => void;
  setActiveTab: (tab: string) => void;
}

export default function ForgotPasswordTab({
  forgotEmail,
  resetCode,
  newPassword,
  resetLoading,
  showResetForm,
  setForgotEmail,
  setResetCode,
  setNewPassword,
  setShowResetForm,
  handleForgotPassword,
  handleResetPassword,
  setActiveTab
}: ForgotPasswordTabProps) {
  return (
    <TabsContent value="forgot" className="space-y-4">
      {showResetForm ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="reset-code">Код из письма</Label>
            <Input
              id="reset-code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
              disabled={resetLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Новый пароль</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Минимум 8 символов"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={resetLoading}
            />
          </div>

          <Button 
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="w-full"
          >
            {resetLoading ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Сброс...
              </>
            ) : (
              <>
                <Icon name="Key" className="w-4 h-4 mr-2" />
                Сменить пароль
              </>
            )}
          </Button>

          <Button 
            onClick={() => {
              setShowResetForm(false);
              setForgotEmail('');
              setResetCode('');
              setNewPassword('');
            }}
            variant="ghost"
            className="w-full text-xs text-gray-400"
          >
            Назад
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="your@email.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={resetLoading}
            />
          </div>

          <Button 
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="w-full"
          >
            {resetLoading ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Mail" className="w-4 h-4 mr-2" />
                Отправить код
              </>
            )}
          </Button>

          <Button 
            onClick={() => setActiveTab('login')}
            variant="ghost"
            className="w-full text-xs text-gray-400"
          >
            Вернуться ко входу
          </Button>
        </>
      )}
    </TabsContent>
  );
}
