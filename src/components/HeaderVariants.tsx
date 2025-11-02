import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const balance = 1234.56;
const notifications = 3;
const userName = 'Иван Иванов';
const userRole = 'Руководитель';

export default function HeaderVariants() {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const variants = [
    {
      id: 1,
      name: 'Avatar Dropdown Menu',
      description: 'Баланс + колокольчик + аватар с выпадающим меню',
      component: (
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
      ),
    },
    {
      id: 2,
      name: 'Compact Card Popup',
      description: 'Только иконки, клик на аватар открывает карточку',
      component: (
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
      ),
    },
    {
      id: 3,
      name: 'Username + Settings Icon',
      description: 'Username вместо кнопок + иконка настроек',
      component: (
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
                <span className="text-sm font-medium">@{userName.toLowerCase().replace(' ', '')}</span>
                <Icon name="Settings" size={16} />
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
      ),
    },
    {
      id: 4,
      name: 'Status Badge Style',
      description: 'Зеленая точка онлайн + имя',
      component: (
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
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold">
                    ИИ
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <span className="font-medium">{userName.split(' ')[0]}</span>
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
      ),
    },
    {
      id: 5,
      name: 'Three Dots Menu',
      description: 'Аватар + три точки меню',
      component: (
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
      ),
    },
    {
      id: 6,
      name: 'Profile Chip Extended',
      description: 'Chip с аватаром, именем и ролью',
      component: (
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
                <div className="text-left">
                  <p className="text-sm font-medium leading-none">{userName.split(' ')[0]}</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
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
      ),
    },
    {
      id: 7,
      name: 'Minimalist Icons Only',
      description: 'Максимально компактно - только иконки',
      component: (
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
              <Button variant="outline" size="sm" className="p-2 relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs font-bold">
                  ИИ
                </div>
                <Icon name="ChevronDown" size={12} className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full" />
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
      ),
    },
    {
      id: 8,
      name: 'Icon Group Compact',
      description: 'Все иконки действий группой + аватар',
      component: (
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
      ),
    },
    {
      id: 9,
      name: 'Inline Compact',
      description: 'Все элементы в одной линии через точки',
      component: (
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
      ),
    },
    {
      id: 10,
      name: 'Glassmorphism Style',
      description: 'Стеклянный эффект с минимализмом',
      component: (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30 backdrop-blur-xl">
            <Icon name="Wallet" size={18} className="text-primary" />
            <span className="font-semibold text-sm">{balance.toFixed(2)} ₽</span>
          </div>
          <Button variant="ghost" size="sm" className="relative p-2 backdrop-blur-sm">
            <Icon name="Bell" size={18} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50">
                {notifications}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 px-3 py-2 backdrop-blur-xl bg-card/40 border-primary/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30">
                  ИИ
                </div>
                <Icon name="ChevronDown" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-card/95">
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
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary animate-shimmer">10 вариантов шапки</h1>
          <p className="text-muted-foreground">Выберите понравившийся вариант</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                selectedVariant === variant.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/50">
                      #{variant.id}
                    </Badge>
                    {variant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
                </div>
                {selectedVariant === variant.id && (
                  <Badge className="bg-primary">
                    <Icon name="Check" size={14} className="mr-1" />
                    Выбрано
                  </Badge>
                )}
              </div>
              <div className="flex justify-end p-4 bg-background/50 rounded-lg border border-border">
                {variant.component}
              </div>
            </div>
          ))}
        </div>

        {selectedVariant && (
          <div className="fixed bottom-8 right-8 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg shadow-primary/50 flex items-center gap-2 animate-slideIn">
            <Icon name="Check" size={20} />
            <span className="font-semibold">Вариант #{selectedVariant} выбран!</span>
          </div>
        )}
      </div>
    </div>
  );
}
