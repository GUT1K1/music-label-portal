import Icon from '@/components/ui/icon';
import { Track } from '../types';

interface WizardStepReviewProps {
  newRelease: {
    release_name: string;
    release_date: string;
    preorder_date: string;
    sales_start_date: string;
    genre: string;
    copyright: string;
    price_category: string;
    title_language: string;
  };
  coverPreview: string | null;
  tracks: Track[];
  releaseType: 'single' | 'maxi-single' | 'ep' | 'album' | null;
  uploading: boolean;
  uploadProgress: number;
  currentUploadFile: string;
}

export default function WizardStepReview({
  newRelease,
  coverPreview,
  tracks,
  releaseType,
  uploading,
  uploadProgress,
  currentUploadFile
}: WizardStepReviewProps) {
  const getReleaseTypeLabel = () => {
    switch (releaseType) {
      case 'single': return 'Сингл';
      case 'maxi-single': return 'Макси-сингл';
      case 'ep': return 'EP';
      case 'album': return 'Альбом';
      default: return 'Не указан';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Проверьте данные</h2>
        <p className="text-sm text-muted-foreground">Убедитесь что всё заполнено правильно перед отправкой</p>
      </div>

      {uploading && (
        <div className="space-y-2.5 p-3.5 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon name="Loader2" size={16} className="animate-spin text-primary flex-shrink-0" />
              <span className="text-sm font-medium truncate">{currentUploadFile || 'Загрузка...'}</span>
            </div>
            <span className="text-sm font-semibold text-primary tabular-nums">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        {/* Cover Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium block">Обложка</label>
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted border-2">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Icon name="ImageOff" size={40} />
              </div>
            )}
          </div>
        </div>

        {/* Release Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Тип релиза</label>
              <p className="text-sm font-medium mt-1">{getReleaseTypeLabel()}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Дата релиза</label>
              <p className="text-sm font-medium mt-1">{newRelease.release_date || '—'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Название</label>
            <p className="text-base font-semibold mt-1">{newRelease.release_name || '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Жанр</label>
              <p className="text-sm mt-1">{newRelease.genre || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Язык</label>
              <p className="text-sm mt-1">{newRelease.title_language || '—'}</p>
            </div>
          </div>

          {(newRelease.preorder_date || newRelease.sales_start_date) && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              {newRelease.preorder_date && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Предзаказ</label>
                  <p className="text-sm mt-1">{newRelease.preorder_date}</p>
                </div>
              )}
              {newRelease.sales_start_date && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Начало продаж</label>
                  <p className="text-sm mt-1">{newRelease.sales_start_date}</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t">
            <label className="text-xs font-medium text-muted-foreground">Копирайт</label>
            <p className="text-sm mt-1">{newRelease.copyright || '—'}</p>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Music" size={18} />
          <h3 className="text-sm font-semibold">Треки ({tracks.length})</h3>
        </div>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-xs font-medium">
                {track.track_number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title || 'Без названия'}</p>
                <p className="text-xs text-muted-foreground truncate">{track.composer || 'Автор не указан'}</p>
              </div>
              <div className="flex items-center gap-2">
                {track.explicit_content && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">E</span>
                )}
                {track.file && (
                  <Icon name="CheckCircle2" size={16} className="text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="CheckCircle" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Готово к отправке</p>
            <p className="text-xs text-muted-foreground">
              После отправки релиз отправится на модерацию. Вы получите уведомление о результатах проверки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}