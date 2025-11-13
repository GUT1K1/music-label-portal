import Icon from '@/components/ui/icon';

/**
 * Вариант 3: ГОРИЗОНТАЛЬНЫЕ ТАБЫ (текущий подход, улучшенный)
 * - Горизонтальная прокрутка табов вверху
 * - Иконки + текст
 * - Адаптивные размеры
 * - Подходит для: средних проектов, универсальность
 */

export default function MenuVariation3() {
  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">🎵 Музыкальный Лейбл</h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Icon name="Wallet" className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-400">15,240 ₽</span>
            </div>
            <button className="p-2 hover:bg-accent/20 rounded-lg transition-all">
              <Icon name="Bell" className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-accent/20 rounded-lg transition-all">
              <img src="https://via.placeholder.com/32" alt="Avatar" className="w-8 h-8 rounded-full" />
            </button>
          </div>
        </div>

        {/* Табы навигации */}
        <div className="container mx-auto px-2 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-1 min-w-max md:min-w-0 pb-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 rounded-lg transition-all whitespace-nowrap">
              <Icon name="Newspaper" className="w-4 h-4 text-yellow-500" />
              <span>Новости</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary/20 text-primary rounded-lg transition-all whitespace-nowrap border-b-2 border-primary">
              <Icon name="Music" className="w-4 h-4" />
              <span>Релизы</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 rounded-lg transition-all whitespace-nowrap">
              <Icon name="BarChart3" className="w-4 h-4 text-blue-500" />
              <span>Аналитика</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 rounded-lg transition-all whitespace-nowrap">
              <Icon name="DollarSign" className="w-4 h-4 text-green-500" />
              <span>Финансы</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 rounded-lg transition-all whitespace-nowrap relative">
              <Icon name="MessageSquare" className="w-4 h-4 text-pink-500" />
              <span>Поддержка</span>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">3</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 rounded-lg transition-all whitespace-nowrap">
              <Icon name="Palette" className="w-4 h-4 text-purple-500" />
              <span>Тема</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Контент */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Вариант 3: Горизонтальные табы</h3>
            <p className="text-muted-foreground mb-4">
              Универсальный подход с табами в шапке
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="font-bold text-green-400 mb-1">✓ Плюсы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Максимум пространства</div>
                  <div>• Универсальность</div>
                  <div>• Легко добавлять разделы</div>
                  <div>• Привычный паттерн</div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="font-bold text-red-400 mb-1">✗ Минусы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Прокрутка на мобильных</div>
                  <div>• Не всегда видны все табы</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
