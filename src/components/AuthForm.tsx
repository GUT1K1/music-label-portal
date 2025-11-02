import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MatrixRain from '@/components/MatrixRain';
import { useNavigate } from 'react-router-dom';

const AUTH_API = 'https://functions.poehali.dev/eb22fe48-55fa-4497-9269-caf203d14d12';

interface AuthFormProps {
  onLogin: (username: string, password: string) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMatrixLoader, setShowMatrixLoader] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    setLoginLoading(true);
    
    try {
      const response = await fetch(`${AUTH_API}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginEmail,
          username: loginEmail,
          password: loginPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Ошибка входа",
          description: data.error || "Неверный email или пароль",
          variant: "destructive"
        });
        setLoginLoading(false);
        return;
      }

      if (data.requires_2fa) {
        toast({
          title: "Проверьте почту",
          description: "Код двухфакторной авторизации отправлен на ваш email",
        });
        setLoginLoading(false);
        return;
      }

      setUserData(data.user);
      setLoginLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setShowMatrixLoader(true);
      }, 1200);
    } catch (error) {
      setLoginLoading(false);
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async () => {
    if (!regUsername || !regEmail || !regPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (regPassword.length < 8) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть не менее 8 символов",
        variant: "destructive"
      });
      return;
    }
    
    setRegLoading(true);
    
    try {
      const response = await fetch(`${AUTH_API}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: regUsername,
          email: regEmail, 
          password: regPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Ошибка регистрации",
          description: data.error || "Не удалось зарегистрироваться",
          variant: "destructive"
        });
        setRegLoading(false);
        return;
      }

      setVerifyEmail(regEmail);
      setShowVerifyCode(true);
      setRegLoading(false);
      toast({
        title: "Код отправлен! 📧",
        description: "Введите код из письма для подтверждения",
      });
    } catch (error) {
      setRegLoading(false);
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    }
  };

  const handleVerifyCode = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Введите 6-значный код",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}?action=verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: verifyEmail,
          code: verifyCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Ошибка",
          description: data.error || "Неверный код",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Email подтверждён! ✅",
        description: "Теперь вы можете войти",
      });
      
      setShowVerifyCode(false);
      setVerifyCode('');
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      setActiveTab('login');
    } catch (error) {
      toast({
        title: "Ошибка сети",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Ошибка",
        description: "Введите email",
        variant: "destructive"
      });
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch(`${AUTH_API}?action=forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Ошибка",
          description: data.error,
          variant: "destructive"
        });
        setResetLoading(false);
        return;
      }

      toast({
        title: "Код отправлен! 📧",
        description: "Проверьте почту",
      });
      
      setShowResetForm(true);
      setResetLoading(false);
    } catch (error) {
      setResetLoading(false);
      toast({
        title: "Ошибка сети",
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть не менее 8 символов",
        variant: "destructive"
      });
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch(`${AUTH_API}?action=reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotEmail,
          code: resetCode,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Ошибка",
          description: data.error,
          variant: "destructive"
        });
        setResetLoading(false);
        return;
      }

      toast({
        title: "Пароль изменён! ✅",
        description: "Теперь войдите с новым паролем",
      });
      
      setShowResetForm(false);
      setForgotEmail('');
      setResetCode('');
      setNewPassword('');
      setResetLoading(false);
      setActiveTab('login');
    } catch (error) {
      setResetLoading(false);
      toast({
        title: "Ошибка сети",
        variant: "destructive"
      });
    }
  };

  if (showMatrixLoader) {
    return (
      <MatrixRain 
        onComplete={() => {
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.href = '/app';
          }
        }} 
        duration={3500} 
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-yellow-950/20 to-black bg-grid-pattern p-4 relative overflow-hidden">
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        className="absolute top-4 left-4 z-10 text-primary hover:text-primary/80"
      >
        <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
        На главную
      </Button>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>
      
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="CheckCircle2" size={48} className="text-primary animate-scaleIn" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 animate-slideIn">Вход выполнен!</h3>
            <p className="text-gray-400 animate-slideIn" style={{ animationDelay: '0.1s' }}>Загружаем личный кабинет...</p>
          </div>
        </div>
      )}
      
      <Card className={`w-full max-w-md border-yellow-500/20 bg-black/60 backdrop-blur-xl transition-all duration-700 ${isSuccess ? 'scale-95 opacity-0' : 'animate-fadeIn scale-100 opacity-100'}`}>
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4 w-32 h-32 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl shadow-yellow-500/50 border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-500 group-hover:scale-110">
              <img 
                src="https://cdn.poehali.dev/files/89837016-5bd9-4196-8bef-fad51c37ba4e.jpg" 
                alt="420 Logo" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer">
            420 Music
          </CardTitle>
          <CardDescription className="text-gray-400 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Музыкальный лейбл • Техподдержка
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${activeTab === 'forgot' ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}>
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
              {activeTab === 'forgot' && <TabsTrigger value="forgot">Восстановление</TabsTrigger>}
            </TabsList>
            
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
                </>
              )}
            </TabsContent>

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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}