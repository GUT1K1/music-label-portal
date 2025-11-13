import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import TrackItem from '../TrackItem';
import { Track } from '../types';

interface WizardStepTracksProps {
  tracks: Track[];
  addTrack: () => void;
  removeTrack: (index: number) => void;
  updateTrack: (index: number, field: keyof Track, value: any) => void;
  moveTrack: (index: number, direction: 'up' | 'down') => void;
  handleBatchUpload: (files: FileList) => void;
}

const WizardStepTracks = memo(function WizardStepTracks({
  tracks,
  addTrack,
  removeTrack,
  updateTrack,
  moveTrack,
  handleBatchUpload
}: WizardStepTracksProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const direction = draggedIndex < dropIndex ? 'down' : 'up';
    const steps = Math.abs(draggedIndex - dropIndex);
    
    let currentIndex = draggedIndex;
    for (let i = 0; i < steps; i++) {
      moveTrack(currentIndex, direction);
      currentIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
    }
    
    setDraggedIndex(null);
  }, [draggedIndex, moveTrack]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Добавьте треки</h2>
        <p className="text-sm text-muted-foreground">Загрузите аудиофайлы и заполните информацию</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="Music" size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium">Треки: {tracks.length}</span>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="file"
              multiple
              accept=".mp3,.wav,.flac,.m4a"
              onChange={(e) => e.target.files && handleBatchUpload(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button size="sm" variant="outline" className="gap-2">
              <Icon name="Upload" size={16} />
              Загрузить файлы
            </Button>
          </div>
          <Button onClick={addTrack} size="sm" className="gap-2">
            <Icon name="Plus" size={16} />
            Добавить
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackItem
            key={`track-${index}-${track.track_number}`}
            track={track}
            index={index}
            totalTracks={tracks.length}
            updateTrack={updateTrack}
            removeTrack={removeTrack}
            moveTrack={moveTrack}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedIndex === index}
          />
        ))}

        {tracks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
            <Icon name="Music" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">Треков пока нет</p>
            <div className="flex gap-2 justify-center">
              <div className="relative">
                <Input
                  type="file"
                  multiple
                  accept=".mp3,.wav,.flac,.m4a"
                  onChange={(e) => e.target.files && handleBatchUpload(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="Upload" size={16} />
                  Загрузить файлы
                </Button>
              </div>
              <Button onClick={addTrack} variant="default" size="sm" className="gap-2">
                <Icon name="Plus" size={16} />
                Добавить вручную
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Подсказка</p>
            <p className="text-xs text-muted-foreground">
              Вы можете загрузить несколько файлов сразу или перетащить их в форму трека. 
              Не забудьте заполнить название и автора для каждого трека.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WizardStepTracks;