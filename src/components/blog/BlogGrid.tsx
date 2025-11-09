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
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Блог о музыкальной индустрии"
        description="Полезные статьи о дистрибуции музыки, продвижении треков, монетизации и музыкальном маркетинге. Гайды, кейсы, инструкции."
        keywords="блог о музыке, продвижение музыки, дистрибуция, музыкальный маркетинг, как продвигать музыку, заработок на музыке"
        url="https://420music.ru/blog"
      />
      <BurgerMenu />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Блог 420 Music
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Гайды, кейсы и инструкции по продвижению музыки. Всё что нужно знать артисту в 2025 году
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full transition-all duration-300 font-medium ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
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
              onClick={() => onPostClick(post)}
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
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