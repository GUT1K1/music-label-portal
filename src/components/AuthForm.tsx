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
  
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  
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
    if (!regEmail || !regPassword || !regFullName) {
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
      console.log('🚀 Отправка регистрации:', { email: regEmail, full_name: regFullName });
      
      const response = await fetch(`${AUTH_API}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: regEmail, 
          password: regPassword,
          full_name: regFullName
        })
      });

      console.log('📡 Статус ответа:', response.status);
      const data = await response.json();
      console.log('📦 Данные ответа:', data);

      if (!response.ok) {
        console.error('❌ Ошибка:', data.error);
        toast({
          title: "Ошибка регистрации",
          description: data.error || "Не удалось зарегистрироваться",
          variant: "destructive"
        });
        setRegLoading(false);
        return;
      }

      console.log('✅ Регистрация успешна');
      toast({
        title: "Регистрация успешна! 🎉",
        description: "Проверьте почту для подтверждения аккаунта",
      });
      
      setRegEmail('');
      setRegPassword('');
      setRegFullName('');
      setRegLoading(false);
      setActiveTab('login');
    } catch (error) {
      console.error('💥 Критическая ошибка:', error);
      setRegLoading(false);
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    }
  };

  if (showMatrixLoader) {
    return (
      <MatrixRain 
        onComplete={() => {
          if (userData) {
            onLogin(userData.username, '');
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  disabled={loginLoading}
                />
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
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-fullname">Имя и Фамилия</Label>
                <Input
                  id="reg-fullname"
                  placeholder="Иван Иванов"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
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
              
              <p className="text-xs text-gray-500 text-center">
                После регистрации проверьте почту для подтверждения аккаунта
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}