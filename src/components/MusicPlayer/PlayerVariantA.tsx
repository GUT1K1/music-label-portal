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

interface PlayerVariantAProps {
  tracks: Track[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function PlayerVariantA({ tracks, currentIndex, onIndexChange }: PlayerVariantAProps) {
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
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl z-50">
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
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary transition-all cursor-pointer"
        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        onClick={handleSeek}
      />

      <div className="container mx-auto px-4 h-[70px] flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {currentTrack.coverUrl && (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.trackName}
              className="w-[50px] h-[50px] rounded-lg object-cover shadow-lg"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">
              {currentTrack.trackName}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-2">
            <button onClick={playPrevious} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <Icon name="SkipBack" size={18} className="text-gray-300 hover:text-white" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-white hover:bg-white/90 rounded-full transition-all hover:scale-105"
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} className="text-black" />
            </button>
            <button onClick={playNext} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <Icon name="SkipForward" size={18} className="text-gray-300 hover:text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 w-full max-w-md">
            <span className="font-mono">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer" onClick={handleSeek}>
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end flex-1">
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
                size={18} 
                className="text-gray-300 hover:text-white" 
              />
            </button>
            {showVolume && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-2 shadow-xl">
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
