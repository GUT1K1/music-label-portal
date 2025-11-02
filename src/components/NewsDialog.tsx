import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface News {
  id: number;
  title: string;
  content: string;
  type: 'update' | 'faq' | 'job';
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

interface NewsDialogProps {
  open: boolean;
  editingNews: News | null;
  formData: {
    title: string;
    content: string;
    type: 'update' | 'faq' | 'job';
    priority: number;
    is_active: boolean;
    image_url?: string;
    poll?: {
      question: string;
      options: string[];
    };
  };
  onOpenChange: (open: boolean) => void;
  onFormDataChange: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function NewsDialog({
  open,
  editingNews,
  formData,
  onOpenChange,
  onFormDataChange,
  onSave,
  onCancel
}: NewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-black via-yellow-950/30 to-black border-primary/30 backdrop-blur-xl shadow-2xl shadow-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            {editingNews ? 'Редактировать новость' : 'Создать новость'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Заголовок"
            value={formData.title}
            onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder="Содержание"
            value={formData.content}
            onChange={(e) => onFormDataChange({ ...formData, content: e.target.value })}
            rows={6}
          />
          <Input
            placeholder="URL изображения (необязательно)"
            value={formData.image_url || ''}
            onChange={(e) => onFormDataChange({ ...formData, image_url: e.target.value })}
          />
          <div className="space-y-2 p-4 bg-black/40 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="BarChart3" className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Добавить опрос (необязательно)</span>
            </div>
            <Input
              placeholder="Вопрос опроса"
              value={formData.poll?.question || ''}
              onChange={(e) => onFormDataChange({ 
                ...formData, 
                poll: { 
                  question: e.target.value, 
                  options: formData.poll?.options || ['', ''] 
                } 
              })}
            />
            {formData.poll?.question && (
              <div className="space-y-2 mt-2">
                {(formData.poll.options || ['', '']).map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Вариант ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(formData.poll?.options || [])];
                        newOptions[index] = e.target.value;
                        onFormDataChange({ 
                          ...formData, 
                          poll: { 
                            question: formData.poll?.question || '', 
                            options: newOptions 
                          } 
                        });
                      }}
                    />
                    {index > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = (formData.poll?.options || []).filter((_, i) => i !== index);
                          onFormDataChange({ 
                            ...formData, 
                            poll: { 
                              question: formData.poll?.question || '', 
                              options: newOptions 
                            } 
                          });
                        }}
                      >
                        <Icon name="X" className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(formData.poll?.options?.length || 0) < 6 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(formData.poll?.options || []), ''];
                      onFormDataChange({ 
                        ...formData, 
                        poll: { 
                          question: formData.poll?.question || '', 
                          options: newOptions 
                        } 
                      });
                    }}
                  >
                    <Icon name="Plus" className="w-4 h-4 mr-2" />
                    Добавить вариант
                  </Button>
                )}
              </div>
            )}
          </div>
          <Select value={formData.type} onValueChange={(value: any) => onFormDataChange({ ...formData, type: value })}>
            <SelectTrigger className="bg-black/40 border-primary/20 hover:border-primary/40 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-primary/30">
              <SelectItem value="update">Обновление</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => onFormDataChange({ ...formData, is_active: checked })}
            />
            <span className="text-sm">Активна</span>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={onSave} className="flex-1">
              <Icon name="Save" className="w-4 h-4 mr-2" />
              {editingNews ? 'Сохранить' : 'Создать'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}