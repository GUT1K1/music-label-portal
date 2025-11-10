import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DemoBlockModalProps {
  open: boolean;
  onClose: () => void;
  actionName: string;
}

export default function DemoBlockModal({ open, onClose, actionName }: DemoBlockModalProps) {
  const handleRegister = () => {
    window.location.href = '/app';
  };

  const handleLogin = () => {
    window.location.href = '/app';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-black/95 border-gold-400/20">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-gold-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center">
            <Icon name="Lock" size={32} className="text-gold-400" />
          </div>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
            {actionName}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 text-base pt-2">
            Чтобы {actionName.toLowerCase()}, нужно зарегистрироваться. Это займёт меньше минуты.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 hover:shadow-2xl hover:shadow-gold-500/50 text-black font-bold text-lg py-6 transition-all duration-300 hover:scale-[1.02]"
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Зарегистрироваться
          </Button>

          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full border-gold-400/30 hover:border-gold-400/50 hover:bg-gold-400/10 text-gray-200 font-semibold py-6"
          >
            <Icon name="LogIn" size={20} className="mr-2" />
            Уже есть аккаунт? Войти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
