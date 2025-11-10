import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  read_time: number;
  image_url: string;
  published_at: string;
  category: string;
}

export default function BlogCarousel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/blog/posts`);
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

  useEffect(() => {
    if (!isAutoPlaying || posts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, posts.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                База знаний
              </h2>
              <p className="text-gray-400 text-lg">
                Всё о музыкальной индустрии и продвижении
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40 transition-all duration-300 group"
            >
              <span>Все статьи</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {posts.map((post) => (
                  <div key={post.id} className="w-full flex-shrink-0">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block group"
                      onMouseEnter={() => setIsAutoPlaying(false)}
                      onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                      <div className="relative h-[500px] rounded-2xl overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm font-bold">
                            {post.category}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {post.read_time} мин
                            </span>
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-yellow-500/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-yellow-500/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-6">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <Link
            to="/blog"
            className="md:hidden mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40 transition-all duration-300 group w-full"
          >
            <span>Все статьи</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
