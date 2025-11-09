import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MatrixRain from '@/components/MatrixRain';
import { useNavigate } from 'react-router-dom';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import ForgotPasswordTab from '@/components/auth/ForgotPasswordTab';
import { useAuthHandlers } from '@/components/auth/useAuthHandlers';

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
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMatrixLoader, setShowMatrixLoader] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const navigate = useNavigate();
  const authHandlers = useAuthHandlers();

  const handleLogin = () => {
    authHandlers.handleLogin(
      loginEmail,
      loginPassword,
      setLoginLoading,
      setUserData,
      setIsSuccess,
      setShowMatrixLoader
    );
  };

  const handleRegister = () => {
    authHandlers.handleRegister(
      regUsername,
      regEmail,
      regPassword,
      setRegLoading,
      setVerifyEmail,
      setShowVerifyCode
    );
  };

  const handleVerifyCode = () => {
    authHandlers.handleVerifyCode(
      verifyEmail,
      verifyCode,
      setShowVerifyCode,
      setVerifyCode,
      setRegUsername,
      setRegEmail,
      setRegPassword,
      setActiveTab
    );
  };

  const handleForgotPassword = () => {
    authHandlers.handleForgotPassword(
      forgotEmail,
      setResetLoading,
      setShowResetForm
    );
  };

  const handleResetPassword = () => {
    authHandlers.handleResetPassword(
      forgotEmail,
      resetCode,
      newPassword,
      setResetLoading,
      setShowResetForm,
      setForgotEmail,
      setResetCode,
      setNewPassword,
      setActiveTab
    );
  };

  const handleTelegramAuth = (userData: any) => {
    authHandlers.handleTelegramAuth(
      userData,
      setUserData,
      setIsSuccess,
      setShowMatrixLoader
    );
  };

  if (showMatrixLoader) {
    return (
      <MatrixRain 
        onComplete={() => {
          if (userData) {
            onLogin('', '', undefined, userData);
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
            
            <LoginTab
              loginEmail={loginEmail}
              loginPassword={loginPassword}
              loginLoading={loginLoading}
              setLoginEmail={setLoginEmail}
              setLoginPassword={setLoginPassword}
              handleLogin={handleLogin}
              setActiveTab={setActiveTab}
              onTelegramAuth={handleTelegramAuth}
            />

            <RegisterTab
              regUsername={regUsername}
              regEmail={regEmail}
              regPassword={regPassword}
              regLoading={regLoading}
              showVerifyCode={showVerifyCode}
              verifyCode={verifyCode}
              agreeTerms={agreeTerms}
              agreePrivacy={agreePrivacy}
              agreeMarketing={agreeMarketing}
              setRegUsername={setRegUsername}
              setRegEmail={setRegEmail}
              setRegPassword={setRegPassword}
              setVerifyCode={setVerifyCode}
              setAgreeTerms={setAgreeTerms}
              setAgreePrivacy={setAgreePrivacy}
              setAgreeMarketing={setAgreeMarketing}
              handleRegister={handleRegister}
              handleVerifyCode={handleVerifyCode}
            />

            <ForgotPasswordTab
              forgotEmail={forgotEmail}
              resetCode={resetCode}
              newPassword={newPassword}
              resetLoading={resetLoading}
              showResetForm={showResetForm}
              setForgotEmail={setForgotEmail}
              setResetCode={setResetCode}
              setNewPassword={setNewPassword}
              setShowResetForm={setShowResetForm}
              handleForgotPassword={handleForgotPassword}
              handleResetPassword={handleResetPassword}
              setActiveTab={setActiveTab}
            />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}