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
}

export default function Variant5({ balance, notifications }: VariantProps) {
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
      <div className="flex items-center gap-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold border-2 border-primary/30">
          ИИ
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <Icon name="MoreVertical" size={18} />
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
