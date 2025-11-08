import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { API_ENDPOINTS } from '@/config/api';

interface Release {
  id: number;
  artist_name: string;
  release_name: string;
  release_image?: string;
  release_file?: string;
}

export default function HeaderMusicPlayer() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadReleases();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const loadReleases = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.RELEASES}?status=approved&limit=50`);
      if (response.ok) {
        const data = await response.json();
        const releasesWithAudio = (Array.isArray(data) ? data : data.releases || [])
          .filter((r: Release) => r.release_file);
        setReleases(releasesWithAudio);
      }
    } catch (error) {
      console.error('Failed to load releases:', error);
    }
  };

  const currentRelease = releases[currentIndex];

  const togglePlay = () => {
    if (!audioRef.current || !currentRelease) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (releases.length === 0) return;
    const nextIndex = (currentIndex + 1) % releases.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const playPrevious = () => {
    if (releases.length === 0) return;
    const prevIndex = currentIndex === 0 ? releases.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const handleEnded = () => {
    playNext();
  };

  if (releases.length === 0 || !currentRelease) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-3 bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 min-w-[380px] max-w-[480px]">
      <audio
        ref={audioRef}
        src={currentRelease.release_file}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {currentRelease.release_image && (
        <img
          src={currentRelease.release_image}
          alt={currentRelease.release_name}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {currentRelease.release_name}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {currentRelease.artist_name}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={playPrevious}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Предыдущий трек"
        >
          <Icon name="SkipBack" size={16} className="text-gray-300" />
        </button>

        <button
          onClick={togglePlay}
          className="p-2 bg-primary/20 hover:bg-primary/30 rounded-full transition-colors"
          title={isPlaying ? 'Пауза' : 'Воспроизвести'}
        >
          <Icon 
            name={isPlaying ? 'Pause' : 'Play'} 
            size={18} 
            className="text-primary" 
          />
        </button>

        <button
          onClick={playNext}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Следующий трек"
        >
          <Icon name="SkipForward" size={16} className="text-gray-300" />
        </button>

        <div 
          className="relative"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Громкость"
          >
            <Icon 
              name={volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'} 
              size={16} 
              className="text-gray-300" 
            />
          </button>
          
          {showVolume && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-xl">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  writingMode: 'bt-lr',
                  WebkitAppearance: 'slider-vertical',
                  height: '60px',
                  width: '4px'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
