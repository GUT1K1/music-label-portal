import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface LoginTabProps {
  loginEmail: string;
  loginPassword: string;
  loginLoading: boolean;
  setLoginEmail: (value: string) => void;
  setLoginPassword: (value: string) => void;
  handleLogin: () => void;
  setActiveTab: (tab: string) => void;
}

export default function LoginTab({
  loginEmail,
  loginPassword,
  loginLoading,
  setLoginEmail,
  setLoginPassword,
  handleLogin,
  setActiveTab
}: LoginTabProps) {
  return (
    <TabsContent value="login" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Логин или Email</Label>
        <Input
          id="login-email"
          type="text"
          placeholder="Введите логин или email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          disabled={loginLoading}
        />
        <p className="text-xs text-gray-400">Можно использовать логин или email для входа</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password">Пароль</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          disabled={loginLoading}
        />
      </div>
      
      <Button 
        onClick={handleLogin}
        disabled={loginLoading}
        className="w-full"
      >
        {loginLoading ? (
          <>
            <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
            Вход...
          </>
        ) : (
          <>
            <Icon name="LogIn" className="w-4 h-4 mr-2" />
            Войти
          </>
        )}
      </Button>

      <Button 
        onClick={() => setActiveTab('forgot')}
        variant="ghost"
        className="w-full text-xs text-gray-400"
      >
        Забыли пароль?
      </Button>
    </TabsContent>
  );
}
