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

export default function Variant9({ balance, notifications, userName }: VariantProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3 px-4 py-2 bg-card/60 backdrop-blur-sm border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="Wallet" size={16} className="text-primary" />
          <span className="font-semibold text-sm">{balance.toFixed(2)} ₽</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <Button variant="ghost" size="sm" className="relative p-0 h-auto">
          <Icon name="Bell" size={16} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {notifications}
            </span>
          )}
        </Button>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs font-bold">
                ИИ
              </div>
              <span className="text-sm font-medium">{userName.split(' ')[0]}</span>
              <Icon name="Zap" size={14} className="text-primary" />
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
    </div>
  );
}
