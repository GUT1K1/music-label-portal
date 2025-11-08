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

interface PlayerVariantDProps {
  tracks: Track[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function PlayerVariantD({ tracks, currentIndex, onIndexChange }: PlayerVariantDProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    onIndexChange(prevIndex);
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
    <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />
      
      <div 
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary transition-all cursor-pointer"
        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        onClick={handleSeek}
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50" />
      </div>

      <div className="container mx-auto px-6 h-[65px] flex items-center gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {currentTrack.coverUrl && (
            <div className="relative">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.trackName}
                className={`w-12 h-12 rounded-lg object-cover shadow-2xl transition-all ${
                  isPlaying 
                    ? 'border-2 border-primary shadow-primary/50' 
                    : 'shadow-primary/30'
                }`}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">
              {currentTrack.trackName}
            </div>
            <div className="text-xs text-white/60 truncate">
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={playPrevious}
            className="p-2 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
          >
            <Icon name="SkipBack" size={18} className="text-white/70 hover:text-white" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-full transition-all hover:scale-110 shadow-lg shadow-primary/40"
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} className="text-white" />
          </button>
          
          <button
            onClick={playNext}
            className="p-2 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
          >
            <Icon name="SkipForward" size={18} className="text-white/70 hover:text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1">
          <span className="text-xs text-white/60 font-mono">{formatTime(currentTime)}</span>
          <div 
            className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer hover:h-1.5 transition-all backdrop-blur-sm relative overflow-hidden group"
            onClick={handleSeek}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-sm opacity-70" />
            </div>
            <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-white/60 font-mono">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div 
            className="relative"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="p-2 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
            >
              <Icon 
                name={volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'} 
                size={18} 
                className="text-white/70 hover:text-white" 
              />
            </button>
            {showVolume && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}