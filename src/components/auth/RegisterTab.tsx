import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface RegisterTabProps {
  regUsername: string;
  regEmail: string;
  regPassword: string;
  regLoading: boolean;
  showVerifyCode: boolean;
  verifyCode: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  setRegUsername: (value: string) => void;
  setRegEmail: (value: string) => void;
  setRegPassword: (value: string) => void;
  setVerifyCode: (value: string) => void;
  setAgreeTerms: (value: boolean) => void;
  setAgreePrivacy: (value: boolean) => void;
  setAgreeMarketing: (value: boolean) => void;
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
  agreeTerms,
  agreePrivacy,
  agreeMarketing,
  setRegUsername,
  setRegEmail,
  setRegPassword,
  setVerifyCode,
  setAgreeTerms,
  setAgreePrivacy,
  setAgreeMarketing,
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
          
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-gray-300 leading-tight cursor-pointer">
                Я ознакомлен(а) и соглашаюсь с{' '}
                <Link to="/terms" className="text-primary hover:underline" target="_blank">
                  договором публичной оферты
                </Link>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacy" 
                checked={agreePrivacy}
                onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
              />
              <label htmlFor="privacy" className="text-sm text-gray-300 leading-tight cursor-pointer">
                Я предоставляю согласие на{' '}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                  обработку персональных данных
                </Link>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="marketing" 
                checked={agreeMarketing}
                onCheckedChange={(checked) => setAgreeMarketing(checked as boolean)}
              />
              <label htmlFor="marketing" className="text-sm text-gray-300 leading-tight cursor-pointer">
                Я предоставляю согласие на получение{' '}
                <Link to="/marketing" className="text-primary hover:underline" target="_blank">
                  рекламных и информационных сообщений
                </Link>
              </label>
            </div>
          </div>

          <Button 
            onClick={handleRegister}
            disabled={regLoading || !agreeTerms || !agreePrivacy}
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