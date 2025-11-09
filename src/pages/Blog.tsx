import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlogPostView from '@/components/blog/BlogPostView';
import BlogGrid from '@/components/blog/BlogGrid';
import { posts } from '@/data/blogData';
import type { BlogPost } from '@/data/blogData';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const slug = location.pathname.replace('/blog/', '').replace('/blog', '');
    if (slug && slug !== '') {
      const post = posts.find(p => p.slug === slug);
      if (post) {
        setSelectedPost(post);
      }
    } else {
      setSelectedPost(null);
    }
  }, [location.pathname]);

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`);
    setSelectedPost(post);
  };

  const handleBackClick = () => {
    navigate('/blog');
    setSelectedPost(null);
  };

  if (selectedPost) {
    return <BlogPostView post={selectedPost} onBack={handleBackClick} />;
  }

  return <BlogGrid posts={posts} onPostClick={handlePostClick} />;
}