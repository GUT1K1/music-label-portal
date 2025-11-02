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

export default function Variant8({ balance, notifications }: VariantProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30">
        <Icon name="Wallet" size={18} className="text-primary" />
        <span className="font-semibold text-sm">{balance.toFixed(2)} ₽</span>
      </div>
      <div className="flex items-center gap-1 border border-border rounded-lg p-1">
        <Button variant="ghost" size="sm" className="relative p-2">
          <Icon name="Bell" size={16} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {notifications}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <Icon name="MessageSquare" size={16} />
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <Icon name="RefreshCw" size={16} />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="p-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold">
              ИИ
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <Icon name="User" size={16} className="mr-2" />
            Профиль
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
