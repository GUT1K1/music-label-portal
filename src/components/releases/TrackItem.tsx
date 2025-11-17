import { useCallback, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Track, LANGUAGES } from './types';

interface TrackItemProps {
  track: Track;
  index: number;
  totalTracks: number;
  updateTrack: (index: number, field: keyof Track, value: any) => void;
  removeTrack: (index: number) => void;
  moveTrack: (index: number, direction: 'up' | 'down') => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  isDragging: boolean;
}

const TrackItem = memo(function TrackItem({ track, index, totalTracks, updateTrack, removeTrack, moveTrack, onDragStart, onDragOver, onDrop, isDragging }: TrackItemProps) {
  // Memoize callbacks
  const handleDragStart = useCallback(() => onDragStart(index), [onDragStart, index]);
  const handleDragOver = useCallback((e: React.DragEvent) => onDragOver(e, index), [onDragOver, index]);
  const handleDrop = useCallback(() => onDrop(index), [onDrop, index]);
  const handleRemove = useCallback(() => removeTrack(index), [removeTrack, index]);
  const handleMoveUp = useCallback(() => moveTrack(index, 'up'), [moveTrack, index]);
  const handleMoveDown = useCallback(() => moveTrack(index, 'down'), [moveTrack, index]);
  
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'title', e.target.value);
  }, [updateTrack, index]);
  
  const handleComposerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'composer', e.target.value);
  }, [updateTrack, index]);
  
  const handleAuthorMusicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'author_music', e.target.value);
  }, [updateTrack, index]);
  
  const handleAuthorLyricsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'author_lyrics', e.target.value);
  }, [updateTrack, index]);
  
  const handleAuthorPhonogramChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'author_phonogram', e.target.value);
  }, [updateTrack, index]);
  
  const handleLanguageChange = useCallback((value: string) => {
    updateTrack(index, 'language_audio', value);
  }, [updateTrack, index]);
  
  const handleExplicitChange = useCallback((value: string) => {
    updateTrack(index, 'explicit_content', value === 'true');
  }, [updateTrack, index]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(index, 'file', e.target.files?.[0]);
  }, [updateTrack, index]);
  
  const handleLyricsChange = useCallback((value: string) => {
    updateTrack(index, 'lyrics_text', value);
  }, [updateTrack, index]);
  
  const handlePreviewChange = useCallback((value: string) => {
    updateTrack(index, 'tiktok_preview_start', parseInt(value) || 0);
  }, [updateTrack, index]);

  return (
    <Card 
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-l-4 border-l-primary/30 md:hover:border-l-primary will-change-transform ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="cursor-move hidden sm:block" title="Перетащите для изменения порядка">
              <Icon name="GripVertical" size={18} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMoveUp} 
                disabled={index === 0}
                className="h-6 w-6 p-0 md:hover:bg-primary/10 active:bg-primary/10"
              >
                <Icon name="ChevronUp" size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMoveDown} 
                disabled={index === totalTracks - 1}
                className="h-6 w-6 p-0 md:hover:bg-primary/10 active:bg-primary/10"
              >
                <Icon name="ChevronDown" size={14} />
              </Button>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-primary">{track.track_number}</span>
            </div>
            <h4 className="font-semibold text-sm sm:text-base">Трек #{track.track_number}</h4>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemove} 
            className="text-destructive md:hover:text-destructive md:hover:bg-destructive/10 active:bg-destructive/10 min-h-[44px] sm:min-h-0 h-10 sm:h-auto w-10 sm:w-auto p-2 sm:p-0"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Название *</label>
            <Input
              placeholder="Название трека"
              value={track.title}
              onChange={handleTitleChange}
              className="text-sm"
              required
              minLength={1}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Артист *</label>
            <Input
              placeholder="Имя артиста"
              value={track.composer}
              onChange={handleComposerChange}
              className="text-sm"
              required
              minLength={1}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Автор музыки *</label>
            <Input
              placeholder="Автор музыки"
              value={track.author_music || ''}
              onChange={handleAuthorMusicChange}
              className="text-sm"
              required
              minLength={1}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Автор текста *</label>
            <Input
              placeholder="Автор текста"
              value={track.author_lyrics || ''}
              onChange={handleAuthorLyricsChange}
              className="text-sm"
              required
              minLength={1}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Автор фонограммы *</label>
            <Input
              placeholder="Автор фонограммы"
              value={track.author_phonogram || ''}
              onChange={handleAuthorPhonogramChange}
              className="text-sm"
              required
              minLength={1}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Язык аудио *</label>
            <Select value={track.language_audio} onValueChange={handleLanguageChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Наличие мата *</label>
            <Select 
              value={track.explicit_content === null ? '' : track.explicit_content ? 'true' : 'false'} 
              onValueChange={handleExplicitChange}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Нет</SelectItem>
                <SelectItem value="true">Да</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Аудио файл (WAV) *</label>
            <div className="relative">
              <Input
                type="file"
                accept=".wav"
                onChange={handleFileChange}
                className="cursor-pointer text-sm"
              />
            </div>
            {(track.file || track.file_url) && (
              <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Music" size={16} className="sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {track.file ? track.file.name : (track.file_name || 'Загруженный файл')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {track.file 
                        ? `${(track.file.size / 1024 / 1024).toFixed(2)} МБ`
                        : (track.file_size ? `${(track.file_size / 1024 / 1024).toFixed(2)} МБ` : 'Уже загружен')
                      }
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                </div>
                {track.preview_url && (
                  <audio controls className="w-full h-9 sm:h-10">
                    <source src={track.preview_url} />
                    Ваш браузер не поддерживает аудио плеер
                  </audio>
                )}
              </div>
            )}
            {!track.file && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Только WAV формат • Максимум 100 МБ
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">Текст песни *</label>
            <Textarea
              placeholder="Введите текст песни..."
              value={track.lyrics_text || ''}
              onChange={(e) => handleLyricsChange(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium mb-1.5 block">TikTok превью (секунды) *</label>
            <Input
              type="number"
              placeholder="0"
              value={track.tiktok_preview_start ?? ''}
              onChange={(e) => handlePreviewChange(e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Время начала фрагмента для TikTok
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default TrackItem;