import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

/**
 * Вариант 1: ВЕРТИКАЛЬНАЯ БОКОВАЯ ПАНЕЛЬ (Desktop + Mobile Drawer)
 * - Боковая панель слева на десктопе
 * - Иконки + текст для лучшей читаемости
 * - На мобильных: выдвижное меню-гамбургер
 * - Подходит для: много разделов, профессиональный вид
 */

export default function MenuVariation1() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: Боковая панель */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card/80 backdrop-blur-sm border-r border-border flex-col p-4 gap-2">
        <div className="mb-6 px-3">
          <h2 className="text-xl font-bold text-primary">🎵 Лейбл</h2>
        </div>
        
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all">
            <Icon name="Newspaper" className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Новости</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary transition-all">
            <Icon name="Music" className="w-5 h-5" />
            <span className="font-medium">Релизы</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all">
            <Icon name="BarChart3" className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Аналитика</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all">
            <Icon name="DollarSign" className="w-5 h-5 text-green-500" />
            <span className="font-medium">Финансы</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all">
            <Icon name="MessageSquare" className="w-5 h-5 text-pink-500" />
            <span className="font-medium">Поддержка</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 text-foreground transition-all">
            <Icon name="Palette" className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Тема</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-500 transition-all w-full">
            <Icon name="LogOut" className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Mobile: Гамбургер меню (показываем только визуал) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-lg">
          <Icon name="Menu" className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Контент */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Вариант 1: Боковая панель</h3>
            <p className="text-muted-foreground">
              Классический вертикальный сайдбар с иконками и текстом
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="font-bold text-green-400 mb-1">✓ Плюсы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Всегда видна навигация</div>
                  <div>• Много места для разделов</div>
                  <div>• Профессиональный вид</div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="font-bold text-red-400 mb-1">✗ Минусы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Занимает место по ширине</div>
                  <div>• На мобильных нужен drawer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
