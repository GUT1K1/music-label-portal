import Icon from '@/components/ui/icon';

/**
 * Вариант 2: НИЖНЯЯ ПАНЕЛЬ (Mobile-First как в приложениях)
 * - Фиксированное меню внизу экрана
 * - Только иконки для компактности
 * - Активный раздел подсвечен
 * - Подходит для: мобильных приложений, быстрый доступ
 */

export default function MenuVariation2() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Контент */}
      <main className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Вариант 2: Нижняя панель</h3>
            <p className="text-muted-foreground mb-4">
              Mobile-first подход как в iOS/Android приложениях
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="font-bold text-green-400 mb-1">✓ Плюсы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Всегда под рукой</div>
                  <div>• Привычно для мобильных</div>
                  <div>• Не занимает контент</div>
                  <div>• Большие зоны нажатия</div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="font-bold text-red-400 mb-1">✗ Минусы</div>
                <div className="text-left space-y-1 text-muted-foreground">
                  <div>• Макс 5-6 пунктов</div>
                  <div>• Закрывает часть экрана</div>
                  <div>• На десктопе менее удобно</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Нижняя навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-screen-xl mx-auto px-2">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent/20 text-muted-foreground transition-all min-w-[64px]">
              <Icon name="Newspaper" className="w-6 h-6" />
              <span className="text-xs font-medium">Новости</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-primary/20 text-primary transition-all min-w-[64px] relative">
              <Icon name="Music" className="w-6 h-6" />
              <span className="text-xs font-medium">Релизы</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full"></div>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent/20 text-muted-foreground transition-all min-w-[64px]">
              <Icon name="BarChart3" className="w-6 h-6" />
              <span className="text-xs font-medium">Статистика</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent/20 text-muted-foreground transition-all min-w-[64px]">
              <Icon name="DollarSign" className="w-6 h-6" />
              <span className="text-xs font-medium">Финансы</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent/20 text-muted-foreground transition-all min-w-[64px] relative">
              <Icon name="MessageSquare" className="w-6 h-6" />
              <span className="text-xs font-medium">Чат</span>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent/20 text-muted-foreground transition-all min-w-[64px]">
              <Icon name="User" className="w-6 h-6" />
              <span className="text-xs font-medium">Профиль</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
