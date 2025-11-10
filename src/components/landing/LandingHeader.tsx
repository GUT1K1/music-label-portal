import Icon from "@/components/ui/icon";

interface LandingHeaderProps {
  isScrolled: boolean;
}

export default function LandingHeader({ isScrolled }: LandingHeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-gold-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gold-400">420</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
              Возможности
            </a>
            <a href="#platforms" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
              Площадки
            </a>
            <a href="/blog" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
              Блог
            </a>
            <a href="#faq" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
              FAQ
            </a>
            <a
              href="/app"
              className="px-6 py-2.5 bg-gold-500 text-black rounded-lg font-semibold text-sm hover:bg-gold-400 transition-all"
            >
              Войти
            </a>
          </nav>

          <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
            <Icon name="Menu" size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}