import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface RegisterTabProps {
  regUsername: string;
  regEmail: string;
  regPassword: string;
  regLoading: boolean;
  showVerifyCode: boolean;
  verifyCode: string;
  setRegUsername: (value: string) => void;
  setRegEmail: (value: string) => void;
  setRegPassword: (value: string) => void;
  setVerifyCode: (value: string) => void;
  handleRegister: () => void;
  handleVerifyCode: () => void;
}

export default function RegisterTab({
  regUsername,
  regEmail,
  regPassword,
  regLoading,
  showVerifyCode,
  verifyCode,
  setRegUsername,
  setRegEmail,
  setRegPassword,
  setVerifyCode,
  handleRegister,
  handleVerifyCode
}: RegisterTabProps) {
  return (
    <TabsContent value="register" className="space-y-4">
      {showVerifyCode ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="verify-code">Код подтверждения</Label>
            <Input
              id="verify-code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              disabled={regLoading}
            />
            <p className="text-xs text-gray-400">Введите 6-значный код из письма</p>
          </div>

          <Button 
            onClick={handleVerifyCode}
            className="w-full"
          >
            <Icon name="CheckCircle2" className="w-4 h-4 mr-2" />
            Подтвердить
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="reg-username">Логин</Label>
            <Input
              id="reg-username"
              placeholder="ivan_petrov"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              disabled={regLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="your@email.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              disabled={regLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-password">Пароль</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Минимум 8 символов"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              disabled={regLoading}
            />
          </div>
          
          <Button 
            onClick={handleRegister}
            disabled={regLoading}
            className="w-full"
          >
            {regLoading ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Регистрация...
              </>
            ) : (
              <>
                <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-400 mt-4">
            Или используйте Telegram/VK во вкладке "Вход" — регистрация произойдёт автоматически
          </p>
        </>
      )}
    </TabsContent>
  );
}