import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import LandingHeader from '@/components/landing/LandingHeader';
import ShareButtons from '@/components/blog/ShareButtons';
import type { BlogPost } from '@/data/blogData';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogPostView({ post, onBack }: BlogPostViewProps) {
  const keywords = `${post.title}, дистрибуция музыки, продвижение музыки, 420 music, ${post.category.toLowerCase()}`;
  
  return (
    <div className="min-h-screen bg-black text-white">
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
      <LandingHeader isScrolled={true} />
      
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
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 group"
        >
          <Icon name="ArrowLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Назад к статьям</span>
        </button>

        <article className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="relative h-[400px] mb-8">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          </div>

          <div className="px-8 md:px-12 pb-12">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
              <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 leading-[1.2]">
              {post.title}
            </h1>

            <div 
              className="prose prose-invert prose-xl max-w-none
                prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-yellow-500/20 prose-h2:leading-tight
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5 prose-h3:text-yellow-400 prose-h3:leading-tight
                prose-p:text-gray-200 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[18px]
                prose-ul:my-6 prose-ul:space-y-3 prose-ul:text-[17px]
                prose-ol:my-6 prose-ol:space-y-3 prose-ol:text-[17px]
                prose-li:text-gray-200 prose-li:leading-[1.75]
                prose-strong:text-yellow-400 prose-strong:font-semibold prose-strong:text-[18px]
                prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:text-yellow-300 hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-5 prose-blockquote:my-10 prose-blockquote:bg-yellow-500/5 prose-blockquote:rounded-r-lg
                prose-blockquote:text-gray-100 prose-blockquote:not-italic prose-blockquote:text-[17px] prose-blockquote:leading-[1.7]
                prose-code:text-yellow-400 prose-code:bg-yellow-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-base prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8
                prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8
                prose-table:my-8 prose-table:border-collapse
                prose-thead:border-b-2 prose-thead:border-yellow-500/30
                prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-yellow-400 prose-th:bg-gray-800/50 prose-th:text-base
                prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-800 prose-td:text-gray-200 prose-td:text-[16px] prose-td:leading-[1.6]
                prose-tr:hover:bg-gray-800/30 prose-tr:transition-colors"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t border-gray-800">
              <ShareButtons 
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </div>
        </article>

        <div className="mt-12 p-8 bg-gray-900 border border-yellow-500/30 rounded-2xl shadow-xl shadow-yellow-500/10">
          <h3 className="text-2xl font-bold text-white mb-3">Понравилась статья?</h3>
          <p className="text-gray-400 mb-6">
            Присоединяйтесь к нашему сообществу музыкантов и получайте эксклюзивные материалы по продвижению музыки
          </p>
          <a 
            href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-yellow-400 hover:via-orange-400 hover:to-amber-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
          >
            <Icon name="Send" size={20} />
            <span>Telegram-канал</span>
          </a>
        </div>
      </div>
    </div>
  );
}