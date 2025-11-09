import { useState } from 'react';
import BurgerMenu from '@/components/BurgerMenu';
import Icon from '@/components/ui/icon';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'Сколько прослушиваний в ТОП 1?',
      excerpt: 'Многие артисты задаются вопросом, сколько прослушиваний нужно для того чтобы попасть в чарты, разные и разных странах у себя в генераторе...',
      content: `
        <h2>Сколько прослушиваний нужно для ТОП-1?</h2>
        <p>Вопрос, который волнует каждого артиста: сколько же нужно прослушиваний, чтобы попасть в топ чартов?</p>
        
        <h3>Российские стриминговые сервисы</h3>
        <ul>
          <li><strong>Яндекс.Музыка:</strong> 800,000 - 1,500,000 прослушиваний в день для попадания в ТОП-1</li>
          <li><strong>VK Музыка:</strong> 500,000 - 1,000,000 прослушиваний в день</li>
        </ul>

        <h3>Международные платформы</h3>
        <ul>
          <li><strong>Spotify (Россия):</strong> 300,000 - 800,000 прослушиваний в день</li>
          <li><strong>Apple Music:</strong> 250,000 - 600,000 прослушиваний в день</li>
        </ul>

        <h3>Факторы влияния</h3>
        <p>На позицию в чартах влияют не только прослушивания:</p>
        <ul>
          <li>Количество уникальных слушателей</li>
          <li>Save Rate (процент сохранений)</li>
          <li>Skip Rate (процент пропусков)</li>
          <li>Динамика роста прослушиваний</li>
          <li>География слушателей</li>
        </ul>

        <p>Важно понимать, что цифры постоянно меняются в зависимости от сезона, конкуренции и активности других артистов.</p>
      `,
      image: 'https://cdn.poehali.dev/files/81d2b3fc-e7ee-4995-b5b8-6fd9eb0b0ac8.png',
      date: '5 ноября 2025',
      readTime: '4 мин',
      category: 'Аналитика'
    },
    {
      id: 2,
      title: 'Тренды 2025. Как стать популярным артистом?',
      excerpt: 'Короткие хиты, вирусы в TikTok, Shorts, VK клипы, относительно фрукциональный тремми в 2025 году. Эти аспекты...',
      content: `
        <h2>Музыкальные тренды 2025 года</h2>
        <p>Индустрия меняется с каждым годом. Вот главные тренды 2025 года для артистов:</p>
        
        <h3>1. Короткие форматы — новая реальность</h3>
        <p>TikTok, YouTube Shorts, VK Клипы — это основные каналы для открытия новой музыки:</p>
        <ul>
          <li>Оптимальная длина трека: 2-2.5 минуты</li>
          <li>Яркий хук в первые 15 секунд</li>
          <li>Запоминающийся припев, который хочется повторять</li>
        </ul>

        <h3>2. Аутентичность важнее продакшена</h3>
        <p>Слушатели ценят искренность:</p>
        <ul>
          <li>Показывайте процесс создания музыки</li>
          <li>Делитесь личными историями</li>
          <li>Будьте собой в соцсетях</li>
        </ul>

        <h3>3. Коллаборации — ключ к росту</h3>
        <p>Совместные треки помогают охватить новую аудиторию:</p>
        <ul>
          <li>Ищите артистов с похожей аудиторией</li>
          <li>Обменивайтесь фичами</li>
          <li>Создавайте ремиксы на чужие треки</li>
        </ul>

        <h3>4. Плейлисты как основной источник прослушиваний</h3>
        <p>80% новых открытий музыки происходит через плейлисты:</p>
        <ul>
          <li>Работайте с кураторами</li>
          <li>Создавайте свои тематические плейлисты</li>
          <li>Анализируйте, в какие плейлисты попадают ваши конкуренты</li>
        </ul>
      `,
      image: 'https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/76195329-3b9b-47ad-a9d4-a44135abae78.jpg',
      date: '3 ноября 2025',
      readTime: '6 мин',
      category: 'Продвижение'
    },
    {
      id: 3,
      title: 'Сколько платят за прослушивания',
      excerpt: 'В эпоху цифровой дистрибуции роялти от прослушиваний играют все более важную роль в монетизации музыки и получаете разное роялти...',
      content: `
        <h2>Сколько платят стриминговые сервисы?</h2>
        <p>Разбираемся, сколько артисты получают за прослушивания на разных платформах.</p>
        
        <h3>Ставки за 1000 прослушиваний</h3>
        <ul>
          <li><strong>Яндекс.Музыка:</strong> $1.50 - $2.50</li>
          <li><strong>VK Музыка:</strong> $1.00 - $2.00</li>
          <li><strong>Apple Music:</strong> $7.00 - $10.00</li>
          <li><strong>Spotify:</strong> $3.00 - $5.00</li>
          <li><strong>YouTube Music:</strong> $0.50 - $1.50</li>
        </ul>

        <h3>От чего зависит выплата?</h3>
        <ul>
          <li>Тип подписки слушателя (Premium платит больше)</li>
          <li>Страна прослушивания</li>
          <li>Процент прослушивания трека</li>
          <li>Условия договора с дистрибьютором</li>
        </ul>

        <h3>Пример расчета</h3>
        <p>100,000 прослушиваний на Spotify = примерно $300-500 долларов до вычета комиссии дистрибьютора (обычно 10-20%).</p>

        <h3>Как увеличить доход?</h3>
        <ul>
          <li>Фокусируйтесь на платформах с высокими ставками (Apple Music)</li>
          <li>Развивайте аудиторию в странах с высокими выплатами (США, Германия, Великобритания)</li>
          <li>Стимулируйте слушателей оформлять Premium подписки</li>
          <li>Выпускайте музыку регулярно — алгоритмы продвигают активных артистов</li>
        </ul>
      `,
      image: 'https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/0f1f5e76-8eba-4b07-b58e-33dfec98efd1.jpg',
      date: '1 ноября 2025',
      readTime: '5 мин',
      category: 'Монетизация'
    },
    {
      id: 4,
      title: 'Продвижение музыки в TikTok',
      excerpt: 'В современном мире музыкальной индустрии TikTok стал одной из самых мощных платформ для открытия и продвижения новой музыки...',
      content: `
        <h2>TikTok: главная платформа для вирусных хитов</h2>
        <p>TikTok изменил правила игры в музыкальной индустрии. Разбираемся, как использовать платформу для продвижения.</p>
        
        <h3>Почему TikTok важен для музыкантов?</h3>
        <ul>
          <li>Более 1 млрд активных пользователей</li>
          <li>Высокая виральность контента</li>
          <li>Прямое влияние на стриминговые чарты</li>
          <li>Возможность органического роста без бюджета</li>
        </ul>

        <h3>Стратегия продвижения в TikTok</h3>
        <p><strong>1. Создайте хук для 15 секунд:</strong></p>
        <ul>
          <li>Яркий момент трека, который запомнится</li>
          <li>Должен вызывать эмоцию или желание повторить</li>
        </ul>

        <p><strong>2. Запустите челлендж:</strong></p>
        <ul>
          <li>Придумайте простое движение или действие под вашу музыку</li>
          <li>Покажите пример первыми</li>
          <li>Попросите других повторить</li>
        </ul>

        <p><strong>3. Работайте с микро-инфлюенсерами:</strong></p>
        <ul>
          <li>5-50 тыс подписчиков часто эффективнее миллионников</li>
          <li>Более доступные цены</li>
          <li>Высокий уровень вовлеченности аудитории</li>
        </ul>

        <h3>Типичные ошибки</h3>
        <ul>
          <li>Слишком сложный контент</li>
          <li>Попытка запихнуть весь трек в 15 секунд</li>
          <li>Отсутствие призыва к действию</li>
          <li>Игнорирование трендов платформы</li>
        </ul>
      `,
      image: 'https://cdn.poehali.dev/files/81d2b3fc-e7ee-4995-b5b8-6fd9eb0b0ac8.png',
      date: '28 октября 2025',
      readTime: '7 мин',
      category: 'Продвижение'
    },
    {
      id: 5,
      title: 'Чек-лист подготовки релиза',
      excerpt: 'Качественное оформление и грамотная подача материала — залог успешного старта релиза и продолжительной жизни трека в музыкальном пространстве...',
      content: `
        <h2>Полный чек-лист подготовки релиза</h2>
        <p>Используйте этот список, чтобы ничего не упустить перед релизом трека.</p>
        
        <h3>За 4-6 недель до релиза</h3>
        <ul>
          <li>✓ Финальный мастеринг трека</li>
          <li>✓ Создание обложки (минимум 3000x3000px)</li>
          <li>✓ Подготовка метаданных (название, артист, авторы, продюсеры)</li>
          <li>✓ Выбор даты релиза (избегайте больших релизов конкурентов)</li>
          <li>✓ Загрузка в дистрибьютор</li>
        </ul>

        <h3>За 2-3 недели до релиза</h3>
        <ul>
          <li>✓ Подача в редакционные плейлисты Spotify</li>
          <li>✓ Создание pre-save кампании</li>
          <li>✓ Подготовка контента для соцсетей</li>
          <li>✓ Создание тизеров (15-30 сек)</li>
          <li>✓ Связь с музыкальными блогерами и кураторами плейлистов</li>
        </ul>

        <h3>За 1 неделю до релиза</h3>
        <ul>
          <li>✓ Анонс даты релиза в соцсетях</li>
          <li>✓ Запуск рекламных кампаний</li>
          <li>✓ Создание Stories/Reels с отрывками</li>
          <li>✓ Подготовка пресс-релиза</li>
        </ul>

        <h3>День релиза</h3>
        <ul>
          <li>✓ Публикация во всех соцсетях</li>
          <li>✓ Отправка ссылок блогерам и журналистам</li>
          <li>✓ Просьба к фанатам сохранить трек</li>
          <li>✓ Мониторинг первых результатов</li>
        </ul>

        <h3>После релиза</h3>
        <ul>
          <li>✓ Ежедневная публикация контента о треке</li>
          <li>✓ Анализ статистики</li>
          <li>✓ Работа с комментариями и фидбеком</li>
          <li>✓ Питчинг в новые плейлисты</li>
        </ul>
      `,
      image: 'https://cdn.poehali.dev/files/81d2b3fc-e7ee-4995-b5b8-6fd9eb0b0ac8.png',
      date: '25 октября 2025',
      readTime: '5 мин',
      category: 'Релизы'
    },
    {
      id: 6,
      title: 'Карточки артиста и как с ними работать',
      excerpt: 'Оптимизация платформ профилей — главный инструмент для привлечения слушателей. А начинается все с правильно оформленной карточки...',
      content: `
        <h2>Как оптимизировать карточку артиста</h2>
        <p>Ваш профиль на стриминговых платформах — это витрина вашего творчества. Разбираемся, как ее правильно оформить.</p>
        
        <h3>Основные элементы карточки артиста</h3>
        
        <p><strong>1. Фото артиста</strong></p>
        <ul>
          <li>Высокое качество (минимум 1500x1500px)</li>
          <li>Узнаваемый образ</li>
          <li>Профессиональная фотография</li>
          <li>Одинаковое фото на всех платформах для узнаваемости</li>
        </ul>

        <p><strong>2. Биография</strong></p>
        <ul>
          <li>Краткая (2-3 предложения) и емкая</li>
          <li>Упомяните жанр и главные достижения</li>
          <li>Добавьте эмоциональный компонент</li>
          <li>Обновляйте после крупных релизов</li>
        </ul>

        <p><strong>3. Ссылки на соцсети</strong></p>
        <ul>
          <li>Instagram — обязательно</li>
          <li>TikTok — крайне желательно</li>
          <li>VK — для русскоязычной аудитории</li>
          <li>YouTube — если есть контент</li>
        </ul>

        <h3>Верификация профиля</h3>
        <p>Как получить галочку:</p>
        <ul>
          <li><strong>Spotify:</strong> Через Spotify for Artists (автоматически после подтверждения)</li>
          <li><strong>Apple Music:</strong> Через Apple Music for Artists</li>
          <li><strong>Яндекс.Музыка:</strong> Связаться с поддержкой дистрибьютора</li>
        </ul>

        <h3>Дополнительные возможности</h3>
        <ul>
          <li>Создание плейлистов от лица артиста</li>
          <li>Добавление концертных дат</li>
          <li>Merchbar для продажи мерча</li>
          <li>Canvas на Spotify (вертикальные видео-луп)</li>
        </ul>
      `,
      image: 'https://cdn.poehali.dev/files/81d2b3fc-e7ee-4995-b5b8-6fd9eb0b0ac8.png',
      date: '22 октября 2025',
      readTime: '6 мин',
      category: 'Продвижение'
    }
  ];

  const categories = ['Все', 'Продвижение', 'Аналитика', 'Релизы', 'Монетизация'];
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredPosts = activeCategory === 'Все' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <BurgerMenu />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8 group"
          >
            <Icon name="ArrowLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Назад к блогу</span>
          </button>

          <div className="mb-8">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
            
            <div className="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-4">
              {selectedPost.category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span>{selectedPost.readTime} чтения</span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-8"></div>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <BurgerMenu />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Блог
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
