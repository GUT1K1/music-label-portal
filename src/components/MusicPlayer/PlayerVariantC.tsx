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

interface PlayerVariantCProps {
  tracks: Track[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function PlayerVariantC({ tracks, currentIndex, onIndexChange }: PlayerVariantCProps) {
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl z-50">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      <div className="container mx-auto px-6 py-4 h-[90px] flex items-center gap-6">
        <div className="flex items-center gap-4 min-w-0" style={{ width: '30%' }}>
          {currentTrack.coverUrl && (
            <div className="relative group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.trackName}
                className="w-[80px] h-[80px] rounded-xl object-cover shadow-2xl"
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 animate-pulse" />
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-white truncate mb-1">
              {currentTrack.trackName}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button
              onClick={playPrevious}
              className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110"
            >
              <Icon name="SkipBack" size={22} className="text-gray-300 hover:text-white" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-4 bg-white hover:bg-white/90 rounded-full transition-all hover:scale-110 shadow-xl"
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="text-black" />
            </button>
            
            <button
              onClick={playNext}
              className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110"
            >
              <Icon name="SkipForward" size={22} className="text-gray-300 hover:text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <span className="text-xs text-gray-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer hover:h-2 transition-all group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all relative"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-gray-400 font-mono w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end" style={{ width: '30%' }}>
          <div 
            className="relative"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="p-2 hover:bg-white/10 rounded-full transition-all"
            >
              <Icon 
                name={volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'} 
                size={20} 
                className="text-gray-300 hover:text-white" 
              />
            </button>
            {showVolume && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 border border-white/20 rounded-lg p-3 shadow-xl">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-28 accent-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
