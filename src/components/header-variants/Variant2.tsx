import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VariantProps {
  balance: number;
  notifications: number;
  userName: string;
  userRole: string;
}

export default function Variant2({ balance, notifications, userName, userRole }: VariantProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30">
        <Icon name="Wallet" size={18} className="text-primary" />
        <span className="font-semibold text-sm">{balance.toFixed(2)} ₽</span>
      </div>
      <Button variant="ghost" size="sm" className="relative p-2">
        <Icon name="Bell" size={18} />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold border-2 border-primary/30">
              ИИ
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-lg font-bold">
              ИИ
            </div>
            <div>
              <p className="font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Сообщения
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-400" size="sm">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
