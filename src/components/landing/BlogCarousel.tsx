import { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  readTime: string;
}

export default function BlogCarousel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/a5045a0c-e192-4009-875b-ec78a3364f52');
        if (response.ok) {
          const data = await response.json();
          const publishedPosts = data.posts
            .filter((post: BlogPost) => post.image_url)
            .slice(0, 6);
          setPosts(publishedPosts);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 relative overflow-hidden scroll-animate">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gold-500/20 rounded-full blur-3xl" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 relative">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              База знаний
            </span>
          </h2>
          
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-4 md:mb-6 rounded-full" />
          
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-8">
            Всё о музыкальной индустрии и продвижении
          </p>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500/10 to-orange-500/10 border border-gold-400/30 text-gold-300 hover:border-gold-400/60 transition-all duration-300 group hover:scale-105"
          >
            <span className="font-bold">Все статьи</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollContainerRef}
            className={`flex gap-6 overflow-x-auto scrollbar-hide pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[500px] group relative"
                style={{ scrollSnapAlign: 'start' }}
                draggable={false}
              >
                <div className="relative h-[450px] md:h-[500px] rounded-[32px] overflow-hidden transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 border-2 border-white/10 rounded-[32px] group-hover:border-gold-400/40 transition-colors duration-500" />
                  
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    draggable={false}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  <div 
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-[100px] opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                    style={{
                      background: index % 3 === 0 ? '#a855f7' : index % 3 === 1 ? '#3b82f6' : '#f97316'
                    }}
                  />

                  <div className="absolute top-6 left-6 z-10">
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-orange-500 text-black text-sm font-black shadow-lg shadow-gold-500/30">
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                    <h3 className="text-2xl md:text-3xl font-black mb-3 text-white group-hover:text-gold-300 transition-colors duration-300 line-clamp-2 drop-shadow-lg">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 text-base md:text-lg mb-4 line-clamp-2 opacity-90">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gold-300 font-bold group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm">Читать</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-gold-500/0 via-transparent to-transparent opacity-0 group-hover:from-gold-500/20 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 text-sm text-gray-500 font-medium">
            ← Листайте карточки →
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}