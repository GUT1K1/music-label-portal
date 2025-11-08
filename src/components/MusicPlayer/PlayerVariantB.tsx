import { useRef, useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Track {
  releaseId: number;
  trackId: number;
  trackName: string;
  artistName: string;
  coverUrl?: string;
  audioUrl: string;
}

interface PlayerVariantBProps {
  tracks: Track[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function PlayerVariantB({ tracks, currentIndex, onIndexChange }: PlayerVariantBProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showExtra, setShowExtra] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    onIndexChange(nextIndex);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50"
      onMouseEnter={() => setShowExtra(true)}
      onMouseLeave={() => setShowExtra(false)}
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      <div className="container mx-auto px-4 h-[50px] flex items-center gap-3">
        {currentTrack.coverUrl && (
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.trackName}
            className="w-10 h-10 rounded object-cover shadow-md"
          />
        )}
        
        <div className="min-w-0 flex-shrink-0" style={{ width: '200px' }}>
          <div className="text-xs font-semibold text-white truncate">
            {currentTrack.trackName}
          </div>
          <div className="text-[10px] text-gray-400 truncate">
            {currentTrack.artistName}
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="p-2 bg-primary hover:bg-primary/90 rounded-full transition-all flex-shrink-0"
        >
          <Icon name={isPlaying ? 'Pause' : 'Play'} size={16} className="text-white" />
        </button>

        {showExtra && (
          <button onClick={playNext} className="p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0">
            <Icon name="SkipForward" size={16} className="text-gray-300" />
          </button>
        )}

        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div 
            className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSeek}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
