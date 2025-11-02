import Icon from '@/components/ui/icon';

export default function MenuShowcase() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-4 text-amber-400">
        Варианты меню для главной страницы
      </h1>
      <p className="text-center text-gray-400 mb-12">Кликни на вариант чтобы выбрать</p>
      
      <div className="space-y-12 max-w-7xl mx-auto">
        
        {/* Вариант 1 - Минималистичное верхнее */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 1 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#1 — Минималистичное верхнее</h2>
          <div className="bg-black/60 rounded-xl p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                420
              </div>
              <nav className="flex gap-8 text-sm font-medium">
                <a className="text-gray-300 hover:text-amber-400 transition">Услуги</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Площадки</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Кейсы</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Контакты</a>
              </nav>
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-lg hover:scale-105 transition">
                Войти
              </button>
            </div>
          </div>
        </div>

        {/* Вариант 2 - С иконками */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 2 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#2 — С иконками</h2>
          <div className="bg-black/60 rounded-xl p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-2">
                <Icon name="Music" className="text-amber-400" size={28} />
                <span className="text-xl font-black text-amber-400">420</span>
              </div>
              <nav className="flex gap-6">
                <a className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition">
                  <Icon name="Sparkles" size={18} />
                  <span className="text-sm font-medium">Услуги</span>
                </a>
                <a className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition">
                  <Icon name="Radio" size={18} />
                  <span className="text-sm font-medium">Площадки</span>
                </a>
                <a className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition">
                  <Icon name="Trophy" size={18} />
                  <span className="text-sm font-medium">Кейсы</span>
                </a>
              </nav>
              <button className="px-6 py-2 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition">
                Войти
              </button>
            </div>
          </div>
        </div>

        {/* Вариант 3 - Футуристичное */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 3 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#3 — Футуристичное с подсветкой</h2>
          <div className="bg-black/60 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">420</span>
              </div>
              <nav className="flex gap-2">
                <a className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition border border-transparent hover:border-amber-500/30">
                  Услуги
                </a>
                <a className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition border border-transparent hover:border-amber-500/30">
                  Площадки
                </a>
                <a className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition border border-transparent hover:border-amber-500/30">
                  Кейсы
                </a>
              </nav>
              <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 transition">
                Войти
              </button>
            </div>
          </div>
        </div>

        {/* Вариант 4 - Центральное */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 4 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#4 — Центральное меню</h2>
          <div className="bg-black/60 rounded-xl p-6">
            <div className="flex flex-col items-center gap-6 max-w-6xl mx-auto">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                420
              </div>
              <nav className="flex gap-8 text-sm font-medium">
                <a className="text-gray-300 hover:text-amber-400 transition">Услуги</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Площадки</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Кейсы</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Контакты</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Вариант 5 - Боковое */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 5 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#5 — Боковое меню (фиксированное)</h2>
          <div className="bg-black/60 rounded-xl p-4 flex gap-4">
            <div className="w-20 bg-gradient-to-b from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col items-center gap-6">
              <div className="text-xl font-black text-amber-400">420</div>
              <div className="flex flex-col gap-4 items-center">
                <Icon name="Home" className="text-gray-400 hover:text-amber-400 transition cursor-pointer" size={24} />
                <Icon name="Music" className="text-gray-400 hover:text-amber-400 transition cursor-pointer" size={24} />
                <Icon name="Radio" className="text-gray-400 hover:text-amber-400 transition cursor-pointer" size={24} />
                <Icon name="Users" className="text-gray-400 hover:text-amber-400 transition cursor-pointer" size={24} />
              </div>
            </div>
            <div className="flex-1 text-gray-400 flex items-center justify-center text-sm">
              Основной контент справа
            </div>
          </div>
        </div>

        {/* Вариант 6 - Стеклянное */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 6 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#6 — Стеклянное (Glassmorphism)</h2>
          <div className="relative bg-black/60 rounded-xl p-4 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-2xl font-black text-white drop-shadow-lg">420</div>
              <nav className="flex gap-6 text-sm font-medium">
                <a className="text-white/80 hover:text-white transition drop-shadow-md">Услуги</a>
                <a className="text-white/80 hover:text-white transition drop-shadow-md">Площадки</a>
                <a className="text-white/80 hover:text-white transition drop-shadow-md">Кейсы</a>
                <a className="text-white/80 hover:text-white transition drop-shadow-md">Контакты</a>
              </nav>
              <button className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg hover:bg-white/30 transition">
                Войти
              </button>
            </div>
          </div>
        </div>

        {/* Вариант 7 - Бургер-меню */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 7 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#7 — Бургер-меню (для мобильных)</h2>
          <div className="bg-black/60 rounded-xl p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                420
              </div>
              <button className="flex flex-col gap-1.5">
                <div className="w-6 h-0.5 bg-amber-400 rounded"></div>
                <div className="w-6 h-0.5 bg-amber-400 rounded"></div>
                <div className="w-6 h-0.5 bg-amber-400 rounded"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Вариант 8 - С поиском */}
        <div 
          className="border border-amber-900/30 rounded-2xl p-6 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
          onClick={() => alert('Вариант 8 выбран!')}
        >
          <h2 className="text-2xl font-bold text-amber-500 mb-4">#8 — С поиском</h2>
          <div className="bg-black/60 rounded-xl p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto gap-8">
              <div className="text-2xl font-black text-amber-400">420</div>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Поиск площадок..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:border-amber-500/50 outline-none transition"
                  />
                </div>
              </div>
              <nav className="flex gap-6 text-sm font-medium">
                <a className="text-gray-300 hover:text-amber-400 transition">Услуги</a>
                <a className="text-gray-300 hover:text-amber-400 transition">Кейсы</a>
              </nav>
              <button className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
                Войти
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
