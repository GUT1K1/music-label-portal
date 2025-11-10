import Icon from "@/components/ui/icon";
import AnimatedLogo from "./AnimatedLogo";

interface LandingHeaderProps {
  isScrolled: boolean;
}

export default function LandingHeader({ isScrolled }: LandingHeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-950/90 backdrop-blur-2xl border-b border-orange-500/20 shadow-lg shadow-orange-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="block">
            <AnimatedLogo />
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
              Возможности
            </a>
            <a href="#platforms" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
              Площадки
            </a>
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
              Блог
            </a>
            <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
              FAQ
            </a>
            <a
              href="/app"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg font-semibold text-sm hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
              style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
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