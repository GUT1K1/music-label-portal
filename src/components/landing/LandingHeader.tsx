import Icon from "@/components/ui/icon";

interface LandingHeaderProps {
  isScrolled: boolean;
}

export default function LandingHeader({ isScrolled }: LandingHeaderProps) {
  return (
    <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-6`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/60 backdrop-blur-xl border border-gold-500/20 shadow-2xl shadow-gold-500/5' 
          : 'bg-black/20 backdrop-blur-md border border-gold-500/10'
      }`}>
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent group-hover:from-gold-200 group-hover:to-gold-400 transition-all">420</span>
            </a>
          
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                Возможности
              </a>
              <a href="#platforms" className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                Площадки
              </a>
              <a href="/blog" className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                Блог
              </a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                FAQ
              </a>
              <a
                href="/app"
                className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-black rounded-xl font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all hover:shadow-lg hover:shadow-gold-500/20"
              >
                Войти
              </a>
            </nav>

            <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}