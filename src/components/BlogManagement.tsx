import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import BlogEditor from '@/components/BlogEditor';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  video_url?: string;
  category: string;
  author_id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
}

interface BlogManagementProps {
  userId: number;
}

export default function BlogManagement({ userId }: BlogManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const loadPosts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/d61fe125-c1fe-446c-a35b-79bd0f0ae128', {
        headers: {
          'X-User-Id': userId.toString()
        }
      });

      if (!response.ok) throw new Error('Failed to load posts');

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Не удалось загрузить статьи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const handleCreatePost = () => {
    setEditingPost(null);
    setEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Удалить эту статью?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/d61fe125-c1fe-446c-a35b-79bd0f0ae128`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({ id: postId })
      });

      if (!response.ok) throw new Error('Failed to delete post');

      toast.success('Статья удалена');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Ошибка при удалении статьи');
    }
  };

  const handleSavePost = async () => {
    setEditorOpen(false);
    await loadPosts();
    toast.success(editingPost ? 'Статья обновлена' : 'Статья создана');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-card/60 backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BookOpen" className="w-5 h-5 text-primary" />
                Управление блогом
              </CardTitle>
              <CardDescription>
                Создавайте и редактируйте статьи блога
              </CardDescription>
            </div>
            <Button onClick={handleCreatePost} className="gap-2">
              <Icon name="Plus" className="w-4 h-4" />
              Создать статью
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Пока нет статей</p>
              <Button onClick={handleCreatePost} variant="outline">
                Создать первую статью
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-all"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Tag" className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className={`flex items-center gap-1 ${post.published ? 'text-green-500' : 'text-orange-500'}`}>
                        <Icon name={post.published ? 'CheckCircle' : 'Clock'} className="w-3 h-3" />
                        {post.published ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditPost(post)}
                    >
                      <Icon name="Pencil" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BlogEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSavePost}
        userId={userId}
        post={editingPost}
      />
    </>
  );
}
