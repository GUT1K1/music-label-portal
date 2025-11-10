import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image = 'https://420.рф/og-image.jpg',
  url = 'https://420.рф',
  type = 'website',
  publishedTime,
  author
}: SEOProps) {
  const fullTitle = `${title} | 420 Music - Дистрибуция музыки`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="420 Music" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* VK / OK Meta Tags */}
      <meta property="vk:image" content={image} />
      
      {/* Telegram Meta Tags */}
      <meta property="telegram:channel" content="@420musicru" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {author && <meta property="article:author" content={author} />}
          <meta property="article:section" content="Музыка" />
        </>
      )}
      
      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Russian" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Schema.org for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'BlogPosting' : 'WebSite',
          "headline": title,
          "description": description,
          "image": image,
          "url": url,
          ...(type === 'article' && publishedTime ? {
            "datePublished": publishedTime,
            "author": {
              "@type": "Organization",
              "name": author || "420 Music"
            },
            "publisher": {
              "@type": "Organization",
              "name": "420 Music",
              "logo": {
                "@type": "ImageObject",
                "url": "https://420.рф/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          } : {})
        })}
      </script>
      
      {/* Breadcrumb Schema для статей */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://420.рф/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Блог",
                "item": "https://420.рф/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": url
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
}