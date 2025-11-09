import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlogPostView from '@/components/blog/BlogPostView';
import BlogGrid from '@/components/blog/BlogGrid';
import type { BlogPost } from '@/data/blogData';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/a5045a0c-e192-4009-875b-ec78a3364f52');
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const slug = location.pathname.replace('/blog/', '').replace('/blog', '');
    if (slug && slug !== '' && posts.length > 0) {
      const post = posts.find(p => p.slug === slug);
      if (post) {
        setSelectedPost(post);
      }
    } else {
      setSelectedPost(null);
    }
  }, [location.pathname, posts]);

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`);
    setSelectedPost(post);
  };

  const handleBackClick = () => {
    navigate('/blog');
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (selectedPost) {
    return <BlogPostView post={selectedPost} onBack={handleBackClick} />;
  }

  return <BlogGrid posts={posts} onPostClick={handlePostClick} />;
}