import { useEffect, useState } from 'react';
import type { BlogPost } from '@/data/blogData';

export default function Sitemap() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/a5045a0c-e192-4009-875b-ec78a3364f52');
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Главная -->
  <url>
    <loc>https://420music.ru/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Личный кабинет -->
  <url>
    <loc>https://420music.ru/app</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Блог -->
  <url>
    <loc>https://420music.ru/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Аналитика -->
  <url>
    <loc>https://420music.ru/analytics</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Маркетинг -->
  <url>
    <loc>https://420music.ru/marketing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Условия использования -->
  <url>
    <loc>https://420music.ru/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Политика конфиденциальности -->
  <url>
    <loc>https://420music.ru/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Статьи блога -->
${posts.map(post => `  <url>
    <loc>https://420music.ru/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      // Устанавливаем правильный Content-Type
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Скачиваем файл
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
      
      URL.revokeObjectURL(url);
    }
  }, [posts]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-primary text-6xl">📄</div>
        <h1 className="text-2xl font-bold">Генерация sitemap.xml</h1>
        <p className="text-muted-foreground">
          {posts.length > 0 
            ? `Загружено ${posts.length} статей. Sitemap будет скачан автоматически.`
            : 'Загрузка статей блога...'}
        </p>
      </div>
    </div>
  );
}
