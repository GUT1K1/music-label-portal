import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VariantProps {
  balance: number;
  notifications: number;
  userName: string;
}

export default function Variant1({ balance, notifications, userName }: VariantProps) {
  return (
    <div className="flex items-center gap-3">
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
          <Button variant="outline" className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold">
              ИИ
            </div>
            <span className="font-medium">{userName.split(' ')[0]}</span>
            <Icon name="ChevronDown" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <Icon name="User" size={16} className="mr-2" />
            Профиль
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="MessageSquare" size={16} className="mr-2" />
            Сообщения
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-400">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
