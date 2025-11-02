import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: 'Music',
      title: 'Дистрибуция',
      description: 'Выпускай релизы на всех площадках: Яндекс Музыка, VK Музыка, Apple Music, Spotify',
      features: ['Быстрая модерация', 'Без комиссий за выпуск', 'Выплаты от 500₽']
    },
    {
      icon: 'TrendingUp',
      title: 'Промо и питчинг',
      description: 'Продвигаем треки в плейлисты и помогаем набрать аудиторию',
      features: ['Попадание в редакционные плейлисты', 'Таргетированная реклама', 'SMM продвижение']
    },
    {
      icon: 'BarChart3',
      title: 'Аналитика и отчёты',
      description: 'Отслеживай статистику прослушиваний и зарабатывай больше',
      features: ['Детальная аналитика', 'Прозрачные выплаты', 'Еженедельные отчёты']
    }
  ];

  const platforms = [
    { name: 'Яндекс Музыка', logo: '🎵', color: 'from-yellow-500/20 to-red-500/20' },
    { name: 'VK Музыка', logo: '🎧', color: 'from-blue-500/20 to-purple-500/20' },
    { name: 'Apple Music', logo: '🍎', color: 'from-pink-500/20 to-rose-500/20' },
    { name: 'Spotify', logo: '🎶', color: 'from-green-500/20 to-emerald-500/20' },
    { name: 'YouTube Music', logo: '▶️', color: 'from-red-500/20 to-orange-500/20' },
    { name: 'SoundCloud', logo: '☁️', color: 'from-orange-500/20 to-yellow-500/20' }
  ];

  const stats = [
    { value: '10+', label: 'лет опыта' },
    { value: '500+', label: 'релизов' },
    { value: '50+', label: 'артистов' },
    { value: '24/7', label: 'поддержка' }
  ];

  const blogPosts = [
    {
      title: 'Как попасть в редакционный плейлист Яндекс Музыки',
      category: 'Продвижение',
      date: '15 октября 2024',
      icon: 'Lightbulb'
    },
    {
      title: 'Гайд по метаданным: как правильно оформить релиз',
      category: 'Инструкции',
      date: '8 октября 2024',
      icon: 'FileText'
    },
    {
      title: 'Топ-5 ошибок начинающих артистов при дистрибуции',
      category: 'Советы',
      date: '1 октября 2024',
      icon: 'AlertCircle'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-primary/10 transition-all duration-300"
        style={{
          borderBottomColor: scrollY > 50 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/89837016-5bd9-4196-8bef-fad51c37ba4e.jpg" 
                alt="420" 
                className="w-12 h-12 rounded-xl border-2 border-primary/30"
              />
              <div>
                <div className="text-2xl font-black text-primary">420</div>
                <div className="text-xs text-gray-500">Музыкальный лейбл</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm hover:text-primary transition-colors">Услуги</a>
              <a href="#platforms" className="text-sm hover:text-primary transition-colors">Площадки</a>
              <a href="#blog" className="text-sm hover:text-primary transition-colors">Блог</a>
              <a href="#contacts" className="text-sm hover:text-primary transition-colors">Контакты</a>
            </nav>

            <Button 
              onClick={() => navigate('/app')}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              <Icon name="LogIn" className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent leading-tight">
              Выпускай музыку на всех площадках
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Дистрибуция, продвижение и аналитика для артистов. Без скрытых комиссий и сложных договоров.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => navigate('/app')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-6"
              >
                Начать бесплатно
                <Icon name="ArrowRight" className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 hover:border-primary text-primary font-semibold text-lg px-8 py-6"
              >
                Узнать больше
                <Icon name="PlayCircle" className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Что мы предлагаем
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Полный комплекс услуг для развития твоей музыкальной карьеры
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-card/40 to-black/40 border-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 p-8"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon name={service.icon as any} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon name="Check" className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Все площадки в одном месте
            </h2>
            <p className="text-gray-400 text-lg">
              Выпускай музыку на крупнейших стриминговых сервисах одним кликом
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-card/30 to-black/30 border border-primary/10 hover:border-primary/40 rounded-xl p-6 transition-all duration-300 hover:scale-110"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
                <div className="relative z-10 text-center">
                  <div className="text-4xl mb-3">{platform.logo}</div>
                  <div className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                    {platform.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Полезные материалы
            </h2>
            <p className="text-gray-400 text-lg">
              Гайды, советы и инструкции для артистов
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-card/40 to-black/40 border-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 p-6 cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon name={post.icon as any} className="w-5 h-5 text-primary" />
                  <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">{post.date}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="border-primary/30 hover:border-primary text-primary"
            >
              Все статьи
              <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Готов выпустить свою музыку?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Присоединяйся к 420 и выведи свою карьеру на новый уровень
            </p>
            <Button 
              onClick={() => navigate('/app')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-12 py-6"
            >
              Начать сейчас
              <Icon name="Rocket" className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="border-t border-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://cdn.poehali.dev/files/89837016-5bd9-4196-8bef-fad51c37ba4e.jpg" 
                  alt="420" 
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-xl font-black text-primary">420</span>
              </div>
              <p className="text-sm text-gray-500">
                Независимый музыкальный лейбл полного цикла
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-primary">Услуги</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-primary transition-colors cursor-pointer">Дистрибуция</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Продвижение</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Аналитика</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-primary">Компания</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-primary transition-colors cursor-pointer">О нас</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Блог</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Контакты</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-primary">Связь</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icon name="Mail" className="w-5 h-5 text-primary" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icon name="Send" className="w-5 h-5 text-primary" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icon name="Music" className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/10 pt-8 text-center text-sm text-gray-500">
            © 2024 420. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
