import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import BurgerMenu from '@/components/BurgerMenu';
import ShareButtons from '@/components/blog/ShareButtons';
import type { BlogPost } from '@/data/blogData';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const keywords = `${post.title}, дистрибуция музыки, продвижение музыки, 420 music, ${post.category.toLowerCase()}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={keywords}
        image={post.image_url}
        url={`https://420.рф/blog/${post.slug}`}
        type="article"
        publishedTime={post.isoDate}
        author="420 Music"
      />
      <BurgerMenu />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-orange-400 transition-colors">Главная</a></li>
            <li className="text-gray-700">/</li>
            <li><a href="/blog" className="hover:text-orange-400 transition-colors">Блог</a></li>
            <li className="text-gray-700">/</li>
            <li className="text-gray-400 truncate max-w-[200px] sm:max-w-none">{post.title}</li>
          </ol>
        </nav>
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-10 group transition-colors"
        >
          <Icon name="ArrowLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Назад к статьям</span>
        </button>

        <article>
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] mb-12 rounded-3xl overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
              <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-full shadow-lg">
                {post.category}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Clock" size={16} />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-16 leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            <div 
              className="prose prose-invert prose-lg lg:prose-xl max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-3xl lg:prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-12 prose-h2:leading-[1.2]
                prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:text-gray-100 prose-h3:leading-[1.3] prose-h3:font-semibold
                prose-p:text-gray-400 prose-p:leading-[2] prose-p:mb-10 prose-p:text-[19px] prose-p:font-light
                prose-ul:my-10 prose-ul:space-y-5
                prose-ol:my-10 prose-ol:space-y-5
                prose-li:text-gray-400 prose-li:leading-[2] prose-li:pl-3 prose-li:text-[18px] prose-li:font-light prose-li:mb-3
                prose-strong:text-gray-100 prose-strong:font-semibold
                prose-a:text-orange-400 prose-a:underline prose-a:decoration-orange-400/30 hover:prose-a:text-orange-300 hover:prose-a:decoration-orange-300/50 prose-a:transition-colors prose-a:underline-offset-4
                prose-blockquote:border-l-[3px] prose-blockquote:border-orange-500/50 prose-blockquote:pl-10 prose-blockquote:pr-10 prose-blockquote:py-8 prose-blockquote:my-16 prose-blockquote:bg-gradient-to-r prose-blockquote:from-orange-500/5 prose-blockquote:to-transparent prose-blockquote:rounded-r-2xl
                prose-blockquote:text-gray-300 prose-blockquote:not-italic prose-blockquote:text-[18px] prose-blockquote:leading-[2] prose-blockquote:font-light
                prose-code:text-orange-400 prose-code:bg-orange-500/10 prose-code:px-2.5 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-[17px] prose-code:before:content-none prose-code:after:content-none prose-code:font-normal
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-2xl prose-pre:p-8 prose-pre:my-14 prose-pre:shadow-2xl
                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-16
                prose-table:w-full prose-table:my-16 prose-table:border-separate prose-table:border-spacing-0 prose-table:overflow-hidden prose-table:rounded-2xl prose-table:border prose-table:border-gray-800/50 prose-table:shadow-xl
                prose-thead:bg-gradient-to-r prose-thead:from-gray-900 prose-thead:to-gray-850
                prose-th:px-6 prose-th:py-5 prose-th:text-left prose-th:font-semibold prose-th:text-gray-200 prose-th:text-[17px] prose-th:first:rounded-tl-2xl prose-th:last:rounded-tr-2xl prose-th:border-b prose-th:border-gray-700/50
                prose-td:px-6 prose-td:py-5 prose-td:text-gray-400 prose-td:text-[17px] prose-td:leading-[1.8] prose-td:border-b prose-td:border-gray-800/30 prose-td:font-light
                prose-tr:transition-colors prose-tr:duration-200
                prose-tbody:prose-tr:hover:bg-gray-900/30"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-16 pt-12 border-t border-gray-800/50">
              <ShareButtons 
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </article>

        <div className="mt-16 p-10 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl shadow-2xl max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">Понравилась статья?</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Присоединяйтесь к нашему сообществу музыкантов и получайте эксклюзивные материалы по продвижению музыки
          </p>
          <a 
            href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-200"
          >
            <Icon name="Send" size={20} />
            <span>Telegram-канал</span>
          </a>
        </div>
      </div>
    </div>
  );
}