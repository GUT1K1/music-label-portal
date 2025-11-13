import Icon from '@/components/ui/icon';

/**
 * Вариант 4: КОМПАКТНЫЙ САЙДБАР С ИКОНКАМИ (минималистичный)
 * - Узкая боковая панель только с иконками
 * - Тултипы при наведении
 * - Разворачивается при клике/наведении
 * - Подходит для: максимум места для контента, современный дизайн
 */

export default function MenuVariation4() {
  return (
    <div className="min-h-screen bg-background">
      {/* Компактный сайдбар */}
      <aside className="fixed left-0 top-0 h-screen w-16 lg:w-20 bg-card/80 backdrop-blur-sm border-r border-border flex flex-col items-center py-6 gap-2 z-50">
        {/* Лого */}
        <div className="mb-4 text-2xl">🎵</div>
        
        {/* Навигация */}
        <div className="flex-1 flex flex-col gap-2 w-full px-2">
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Новости">
            <Icon name="Newspaper" className="w-6 h-6 text-yellow-500" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Новости
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl bg-primary/20 text-primary transition-all border-l-2 border-primary"
            title="Релизы">
            <Icon name="Music" className="w-6 h-6" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Релизы
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Аналитика">
            <Icon name="BarChart3" className="w-6 h-6 text-blue-500" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Аналитика
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Финансы">
            <Icon name="DollarSign" className="w-6 h-6 text-green-500" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Финансы
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Поддержка">
            <div className="relative">
              <Icon name="MessageSquare" className="w-6 h-6 text-pink-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </div>
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Поддержка
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Тема">
            <Icon name="Palette" className="w-6 h-6 text-purple-500" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Тема оформления
            </div>
          </button>
        </div>
        
        {/* Нижние кнопки */}
        <div className="flex flex-col gap-2 w-full px-2 pt-4 border-t border-border">
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-accent/20 text-muted-foreground transition-all"
            title="Настройки">
            <Icon name="Settings" className="w-6 h-6" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Настройки
            </div>
          </button>
          
          <button 
            className="relative group w-full aspect-square flex items-center justify-center rounded-xl hover:bg-red-500/20 text-red-500 transition-all"
            title="Выйти">
            <Icon name="LogOut" className="w-6 h-6" />
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Выйти
            </div>
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main className="ml-16 lg:ml-20 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Вариант 4: Компактный сайдбар</h3>
            <p className="text-muted-foreground mb-4">
              Минималистичная панель с иконками и тултипами
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="font-bold text-green-400 mb-1">✓ Плюсы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Минимум места</div>
                  <div>• Современный вид</div>
                  <div>• Всегда видна навигация</div>
                  <div>• Быстрый доступ</div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="font-bold text-red-400 mb-1">✗ Минусы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Нужны тултипы</div>
                  <div>• Менее очевидно для новых</div>
                  <div>• Макс 8-10 пунктов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
