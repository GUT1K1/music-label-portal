import { useToast } from '@/hooks/use-toast';

const AUTH_API = 'https://functions.poehali.dev/7847ab7a-8881-4e5d-b785-33d719f53db6';

export const useAuthHandlers = () => {
  const { toast } = useToast();

  const handleLogin = async (
    loginEmail: string,
    loginPassword: string,
    setLoginLoading: (loading: boolean) => void,
    setUserData: (data: any) => void,
    setIsSuccess: (success: boolean) => void,
    setShowMatrixLoader: (show: boolean) => void
  ) => {
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

  const handleRegister = async (
    regUsername: string,
    regEmail: string,
    regPassword: string,
    setRegLoading: (loading: boolean) => void,
    setVerifyEmail: (email: string) => void,
    setShowVerifyCode: (show: boolean) => void
  ) => {
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

  const handleVerifyCode = async (
    verifyEmail: string,
    verifyCode: string,
    setShowVerifyCode: (show: boolean) => void,
    setVerifyCode: (code: string) => void,
    setRegUsername: (username: string) => void,
    setRegEmail: (email: string) => void,
    setRegPassword: (password: string) => void,
    setActiveTab: (tab: string) => void
  ) => {
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

  const handleForgotPassword = async (
    forgotEmail: string,
    setResetLoading: (loading: boolean) => void,
    setShowResetForm: (show: boolean) => void
  ) => {
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

  const handleResetPassword = async (
    forgotEmail: string,
    resetCode: string,
    newPassword: string,
    setResetLoading: (loading: boolean) => void,
    setShowResetForm: (show: boolean) => void,
    setForgotEmail: (email: string) => void,
    setResetCode: (code: string) => void,
    setNewPassword: (password: string) => void,
    setActiveTab: (tab: string) => void
  ) => {
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

  const handleTelegramAuth = async (
    userData: any,
    setUserData: (data: any) => void,
    setIsSuccess: (success: boolean) => void,
    setShowMatrixLoader: (show: boolean) => void
  ) => {
    try {
      setUserData(userData);
      setIsSuccess(true);
      
      setTimeout(() => {
        setShowMatrixLoader(true);
      }, 1200);
    } catch (error) {
      toast({
        title: "Ошибка авторизации",
        description: "Не удалось войти через Telegram",
        variant: "destructive"
      });
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleVerifyCode,
    handleForgotPassword,
    handleResetPassword,
    handleTelegramAuth
  };
};