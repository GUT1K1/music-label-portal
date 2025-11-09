import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import BurgerMenu from '@/components/BurgerMenu';
import type { BlogPost } from '@/data/blogData';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const keywords = `${post.title}, дистрибуция музыки, продвижение музыки, 420 music, ${post.category.toLowerCase()}`;
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={keywords}
        image={post.image}
        url={`https://420music.ru/blog/${post.slug}`}
        type="article"
        publishedTime={post.isoDate}
        author="420 Music"
      />
      <BurgerMenu />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-orange-400">Главная</a></li>
            <li>/</li>
            <li><a href="/blog" className="hover:text-orange-400">Блог</a></li>
            <li>/</li>
            <li className="text-gray-400">{post.title}</li>
          </ol>
        </nav>
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8 group"
        >
          <Icon name="ArrowLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Назад к статьям</span>
        </button>

        <article className="bg-gradient-to-br from-purple-900/10 via-transparent to-transparent rounded-2xl overflow-hidden">
          <div className="relative h-[400px] mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
          </div>

          <div className="px-6 pb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-orange-500/20
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-orange-400
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-ul:space-y-3
                prose-li:text-gray-300 prose-li:leading-relaxed
                prose-strong:text-orange-400 prose-strong:font-semibold
                prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300 hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:bg-orange-500/5 prose-blockquote:rounded-r-lg
                prose-blockquote:text-gray-200 prose-blockquote:not-italic
                prose-code:text-orange-400 prose-code:bg-orange-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl prose-pre:p-6
                prose-img:rounded-xl prose-img:shadow-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        <div className="mt-12 p-6 bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-2xl border border-orange-500/20">
          <h3 className="text-xl font-bold text-white mb-3">Понравилась статья?</h3>
          <p className="text-gray-400 mb-4">
            Присоединяйтесь к нашему сообществу музыкантов и получайте эксклюзивные материалы по продвижению музыки
          </p>
          <a 
            href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
          >
            <Icon name="Send" size={20} />
            <span>Telegram-канал</span>
          </a>
        </div>
      </div>
    </div>
  );
}
