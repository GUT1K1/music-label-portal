import Icon from "@/components/ui/icon";

interface LandingHeaderProps {
  isScrolled: boolean;
}

export default function LandingHeader({ isScrolled }: LandingHeaderProps) {
  return (
    <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-6`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/70 backdrop-blur-xl border border-gold-400/30 shadow-2xl shadow-gold-500/10' 
          : 'bg-black/30 backdrop-blur-lg border border-gold-400/20'
      }`}>
        <div className="px-8 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            <a href="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                <span className="text-[32px] font-black bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 bg-clip-text text-transparent group-hover:from-gold-100 group-hover:via-gold-300 group-hover:to-gold-500 transition-all duration-500 animate-shimmer bg-[length:200%_100%]">
                  420
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400/0 via-gold-300/30 to-gold-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </a>
          
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-300 hover:text-gold-300 transition-all duration-300 relative group">
                Возможности
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#platforms" className="text-sm font-medium text-gray-300 hover:text-gold-300 transition-all duration-300 relative group">
                Платформы
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-gold-300 transition-all duration-300 relative group">
                Вопросы
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="/app"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black rounded-xl font-bold text-sm hover:from-gold-300 hover:via-gold-400 hover:to-gold-500 transition-all duration-300 hover:shadow-lg hover:shadow-gold-400/30 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Начать</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </nav>

            <button className="md:hidden p-2 text-gray-300 hover:text-gold-300 transition-colors">
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}