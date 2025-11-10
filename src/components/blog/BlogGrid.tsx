import { useState } from 'react';
import SEO from '@/components/SEO';
import BurgerMenu from '@/components/BurgerMenu';
import { categories } from '@/data/blogData';
import type { BlogPost } from '@/data/blogData';

interface BlogGridProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
}

export default function BlogGrid({ posts, onPostClick }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredPosts = activeCategory === 'Все' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SEO
        title="Блог о музыкальной индустрии"
        description="Полезные статьи о дистрибуции музыки, продвижении треков, монетизации и музыкальном маркетинге. Гайды, кейсы, инструкции."
        keywords="блог о музыке, продвижение музыки, дистрибуция, музыкальный маркетинг, как продвигать музыку, заработок на музыке"
        url="https://420music.ru/blog"
      />
      <BurgerMenu />
      
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block animate-scaleIn">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 blur-3xl opacity-20 animate-pulse-slow"></div>
              <h1 className="relative text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Блог 420 Music
              </h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fadeIn animation-delay-200">
            Гайды, кейсы и инструкции по продвижению музыки. Всё что нужно знать артисту в 2025 году
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-16 animate-slideUp animation-delay-300">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group px-6 py-3 rounded-full transition-all duration-500 font-semibold transform hover:scale-105 animate-fadeIn ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-black shadow-xl shadow-yellow-500/40 scale-105'
                  : 'bg-gray-900/80 backdrop-blur-sm text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10'
              }`}
            >
              <span className="relative z-10">{category}</span>
              {activeCategory !== category && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-yellow-500/10 group-hover:via-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500"></div>
              )}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              onClick={() => onPostClick(post)}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-md border border-gray-800/50 rounded-3xl overflow-hidden cursor-pointer hover:border-yellow-500/50 transition-all duration-700 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-2 animate-fadeIn"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-yellow-500/5 group-hover:via-orange-500/5 group-hover:to-amber-500/5 transition-all duration-700 pointer-events-none"></div>
              
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 filter group-hover:brightness-110"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-black rounded-full shadow-lg backdrop-blur-sm group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300 transform group-hover:scale-105">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-amber-500/20"></div>
                </div>
              </div>

              <div className="relative p-6 space-y-4">
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-500">
                  {post.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800/50 group-hover:border-yellow-500/20 transition-colors duration-500">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-500/70">
                    {post.readTime}
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}