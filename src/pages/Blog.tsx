import { useState } from 'react';
import BurgerMenu from '@/components/BurgerMenu';
import Icon from '@/components/ui/icon';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  category: string;
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'Как правильно подготовить трек к релизу',
      excerpt: 'Основные этапы подготовки музыки перед публикацией на стриминговых платформах',
      content: `
        <h2>Подготовка трека к релизу</h2>
        <p>Перед публикацией трека на стриминговых платформах важно учесть несколько ключевых моментов:</p>
        
        <h3>1. Мастеринг</h3>
        <p>Убедитесь, что трек правильно отмастерен. Рекомендуемые параметры:</p>
        <ul>
          <li>Loudness: -14 LUFS для большинства платформ</li>
          <li>True Peak: не выше -1.0 dB</li>
          <li>Формат: WAV 44.1kHz 16-bit или выше</li>
        </ul>

        <h3>2. Метаданные</h3>
        <p>Заполните все необходимые поля:</p>
        <ul>
          <li>Название трека и исполнитель</li>
          <li>Жанр и язык</li>
          <li>Дата релиза</li>
          <li>Авторские права</li>
        </ul>

        <h3>3. Обложка</h3>
        <p>Требования к обложке:</p>
        <ul>
          <li>Минимум 3000x3000 пикселей</li>
          <li>Формат: JPG или PNG</li>
          <li>Без логотипов стриминговых сервисов</li>
        </ul>
      `,
      author: 'Анна Смирнова',
      role: 'Менеджер по релизам',
      date: '15 января 2025',
      readTime: '5 мин',
      category: 'Релизы'
    },
    {
      id: 2,
      title: 'Стратегии продвижения в плейлисты Spotify',
      excerpt: 'Проверенные методы попадания в редакционные и пользовательские плейлисты',
      content: `
        <h2>Продвижение в плейлисты</h2>
        <p>Попадание в плейлисты — ключевой фактор успеха на Spotify.</p>
        
        <h3>Редакционные плейлисты</h3>
        <p>За 2-4 недели до релиза:</p>
        <ul>
          <li>Подайте заявку через Spotify for Artists</li>
          <li>Детально опишите трек и его историю</li>
          <li>Укажите похожих артистов</li>
        </ul>

        <h3>Пользовательские плейлисты</h3>
        <p>Стратегия работы с кураторами:</p>
        <ul>
          <li>Найдите подходящие по жанру плейлисты</li>
          <li>Свяжитесь с куратором лично</li>
          <li>Предложите ценность для его аудитории</li>
        </ul>
      `,
      author: 'Дмитрий Волков',
      role: 'Специалист по промо',
      date: '12 января 2025',
      readTime: '7 мин',
      category: 'Продвижение'
    },
    {
      id: 3,
      title: 'Аналитика релизов: на что обращать внимание',
      excerpt: 'Ключевые метрики для оценки успешности вашего релиза',
      content: `
        <h2>Важные метрики</h2>
        <p>Анализируйте эти показатели после релиза:</p>
        
        <h3>Первая неделя</h3>
        <ul>
          <li>Количество прослушиваний</li>
          <li>Save Rate (процент сохранений)</li>
          <li>Skip Rate (процент пропусков)</li>
        </ul>

        <h3>Первый месяц</h3>
        <ul>
          <li>География слушателей</li>
          <li>Источники трафика</li>
          <li>Playlist adds (добавления в плейлисты)</li>
        </ul>

        <h3>Что важнее всего?</h3>
        <p>Save Rate — главный показатель качества. Если больше 30% слушателей сохраняют трек, алгоритмы будут продвигать его активнее.</p>
      `,
      author: 'Елена Петрова',
      role: 'Аналитик',
      date: '10 января 2025',
      readTime: '6 мин',
      category: 'Аналитика'
    }
  ];

  const categories = ['Все', 'Релизы', 'Продвижение', 'Аналитика'];
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredPosts = activeCategory === 'Все' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-black text-white">
        <BurgerMenu />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 group"
          >
            <Icon name="ArrowLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Вернуться к статьям</span>
          </button>

          <div className="mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm mb-4">
              {selectedPost.category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium">{selectedPost.author}</div>
                  <div className="text-gray-500 text-xs">{selectedPost.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime} чтения</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-8"></div>

          <div 
            className="prose prose-invert prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            style={{
              '--tw-prose-body': '#e5e7eb',
              '--tw-prose-headings': '#f59e0b',
              '--tw-prose-links': '#fbbf24',
            } as any}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-float"
          style={{
            background: 'linear-gradient(45deg, #eab308, #fb923c)',
            top: '10%',
            left: '5%',
            animationDuration: '25s',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-10 animate-float"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
            bottom: '10%',
            right: '10%',
            animationDuration: '30s',
            animationDelay: '5s',
          }}
        />
      </div>

      <BurgerMenu />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            📝 Блог 420 Music
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Полезные статьи
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Советы от нашей команды по релизам, продвижению и аналитике музыки
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/30'
                  : 'bg-amber-500/5 border border-amber-500/30 text-amber-400 hover:border-amber-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-3xl p-6 hover:border-amber-500/40 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{post.author}</div>
                      <div className="text-gray-500 text-xs">{post.role}</div>
                    </div>
                  </div>

                  <Icon 
                    name="ArrowRight" 
                    size={20} 
                    className="text-amber-500 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
