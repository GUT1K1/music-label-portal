import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function sitemapGenerator(): Plugin {
  return {
    name: 'vite-plugin-sitemap-generator',
    apply: 'build',
    async closeBundle() {
      console.log('🗺️  Генерация sitemap.xml...');
      
      try {
        // Загружаем статьи блога из API
        const response = await fetch('https://functions.poehali.dev/a5045a0c-e192-4009-875b-ec78a3364f52');
        const data = await response.json();
        const posts = data.posts || [];
        
        console.log(`📝 Загружено ${posts.length} статей блога`);
        
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
  
  <!-- Статьи блога (${posts.length} статей) -->
${posts.map((post: any) => `  <url>
    <loc>https://420music.ru/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

        // Сохраняем в dist/sitemap.xml
        const distDir = path.resolve(process.cwd(), 'dist');
        const sitemapPath = path.join(distDir, 'sitemap.xml');
        
        fs.writeFileSync(sitemapPath, sitemap, 'utf8');
        
        console.log('✅ Sitemap успешно сгенерирован!');
        console.log(`📍 Файл: ${sitemapPath}`);
        console.log(`📊 Всего URL: ${posts.length + 7}`);
      } catch (error) {
        console.error('❌ Ошибка при генерации sitemap:', error);
      }
    }
  };
}
