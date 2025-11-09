import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface BlogPost {
  id?: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  image_url?: string;
  video_url?: string;
  category: string;
  published: boolean;
}

interface BlogEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  userId: number;
  post?: BlogPost | null;
}

export default function BlogEditor({ open, onClose, onSave, userId, post }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    video_url: '',
    category: 'Общее',
    published: true
  });
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        image_url: post.image_url || '',
        video_url: post.video_url || ''
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        video_url: '',
        category: 'Общее',
        published: true
      });
    }
  }, [post, open]);

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    setUploadingMedia(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('https://functions.poehali.dev/9f1dc4ec-d1c5-4a06-b9bc-7dcdc41fd3b0', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      if (type === 'image') {
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        setFormData(prev => ({ ...prev, video_url: data.url }));
      }

      toast.success(type === 'image' ? 'Изображение загружено' : 'Видео загружено');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка при загрузке файла');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Заполните заголовок и содержание');
      return;
    }

    setSaving(true);
    try {
      const method = post?.id ? 'PUT' : 'POST';
      const body = post?.id ? { ...formData, id: post.id } : formData;

      const response = await fetch('https://functions.poehali.dev/d61fe125-c1fe-446c-a35b-79bd0f0ae128', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Save failed');

      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Ошибка при сохранении статьи');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="FileText" className="w-5 h-5 text-primary" />
            {post?.id ? 'Редактировать статью' : 'Создать статью'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Название статьи"
              />
            </div>

            <div>
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Общее, Новости, Гайд..."
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Краткое описание статьи (1-2 предложения)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Содержание</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Основной текст статьи (поддержка Markdown)"
                rows={12}
              />
            </div>

            <div className="space-y-3">
              <Label>Медиа (опционально)</Label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'image');
                    }}
                    disabled={uploadingMedia}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingMedia}
                      asChild
                    >
                      <span>
                        <Icon name="Image" className="w-4 h-4 mr-2" />
                        Загрузить изображение
                      </span>
                    </Button>
                  </label>
                  {formData.image_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    >
                      <Icon name="X" className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'video');
                    }}
                    disabled={uploadingMedia}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingMedia}
                      asChild
                    >
                      <span>
                        <Icon name="Video" className="w-4 h-4 mr-2" />
                        Загрузить видео
                      </span>
                    </Button>
                  </label>
                  {formData.video_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                    >
                      <Icon name="X" className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {formData.video_url && (
                  <video src={formData.video_url} controls className="w-full rounded-lg max-h-40" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Опубликовать сразу
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 bg-card/40">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Eye" className="w-4 h-4 text-primary" />
                Превью
              </h3>
              <div className="space-y-3">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {formData.video_url && (
                  <video
                    src={formData.video_url}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
                <h4 className="text-xl font-bold">{formData.title || 'Заголовок статьи'}</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.excerpt || 'Краткое описание...'}
                </p>
                <div className="prose prose-sm max-w-none">
                  {formData.content ? (
                    <div className="text-sm whitespace-pre-wrap">{formData.content}</div>
                  ) : (
                    <p className="text-muted-foreground">Содержание статьи...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" className="w-4 h-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
