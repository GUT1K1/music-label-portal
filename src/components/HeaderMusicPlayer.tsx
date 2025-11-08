import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { API_ENDPOINTS } from '@/config/api';

interface Track {
  releaseId: number;
  trackId: number;
  trackName: string;
  artistName: string;
  coverUrl?: string;
  audioUrl: string;
}

interface HeaderMusicPlayerProps {
  userId: number;
}

export interface MusicPlayerState {
  isPlaying: boolean;
  currentTrack: string;
}

export default function HeaderMusicPlayer({ userId }: HeaderMusicPlayerProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadTracks();
    
    const interval = setInterval(() => {
      loadTracks();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const loadTracks = async () => {
    try {
      console.log('[HeaderMusicPlayer] Loading tracks...');
      const response = await fetch(`${API_ENDPOINTS.RELEASES}?status=approved&limit=50`, {
        headers: {
          'X-User-Id': userId.toString()
        }
      });
      
      if (response.ok) {
        const releases = await response.json();
        const releasesArray = Array.isArray(releases) ? releases : [];
        console.log(`[HeaderMusicPlayer] Found ${releasesArray.length} approved releases`);
        
        const allTracks: Track[] = [];
        
        for (const release of releasesArray) {
          const releaseDetailResponse = await fetch(
            `${API_ENDPOINTS.RELEASES}?release_id=${release.id}`,
            {
              headers: {
                'X-User-Id': userId.toString()
              }
            }
          );
          
          if (releaseDetailResponse.ok) {
            const releaseDetail = await releaseDetailResponse.json();
            const releaseTracks = releaseDetail.tracks || [];
            console.log(`[HeaderMusicPlayer] Release "${release.release_name}" has ${releaseTracks.length} tracks`);
            
            for (const track of releaseTracks) {
              const audioUrl = track.audio_url || track.file_url;
              if (audioUrl) {
                console.log(`[HeaderMusicPlayer] ✅ Track with audio: ${track.track_name || track.title}`);
                allTracks.push({
                  releaseId: release.id,
                  trackId: track.id,
                  trackName: track.track_name || track.title || 'Без названия',
                  artistName: release.artist_name,
                  coverUrl: release.cover_url,
                  audioUrl: audioUrl
                });
              } else {
                console.log(`[HeaderMusicPlayer] ❌ Track without audio: ${track.track_name || track.title}`);
              }
            }
          }
        }
        
        console.log(`[HeaderMusicPlayer] Total tracks with audio: ${allTracks.length}`);
        setTracks(allTracks);
      } else {
        console.error(`[HeaderMusicPlayer] Failed to load releases: ${response.status}`);
      }
    } catch (error) {
      console.error('[HeaderMusicPlayer] Failed to load tracks:', error);
    }
  };

  const currentTrack = tracks[currentIndex];

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
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
    if (tracks.length === 0) return;
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
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

  if (tracks.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-primary/30 transition-all min-w-[350px] max-w-[420px] group">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      {currentTrack.coverUrl && (
        <div className="relative flex-shrink-0">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.trackName}
            className="w-11 h-11 rounded-lg object-cover shadow-lg"
          />
          {isPlaying && (
            <div className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse" />
          )}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
          {currentTrack.trackName}
        </div>
        <div className="text-xs text-gray-400 truncate flex items-center gap-2">
          <span>{currentTrack.artistName}</span>
          <span className="text-primary/50">•</span>
          <span className="font-mono text-primary/60">{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div 
          className="mt-1 h-0.5 bg-white/10 rounded-full cursor-pointer group/progress relative overflow-hidden"
          onClick={handleSeek}
        >
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={playPrevious}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
          title="Предыдущий трек"
        >
          <Icon name="SkipBack" size={16} className="text-gray-400 hover:text-primary transition-colors" />
        </button>

        <button
          onClick={togglePlay}
          className="p-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-full transition-all hover:scale-105 shadow-lg shadow-primary/20"
          title={isPlaying ? 'Пауза' : 'Воспроизвести'}
        >
          <Icon 
            name={isPlaying ? 'Pause' : 'Play'} 
            size={16} 
            className="text-white" 
          />
        </button>

        <button
          onClick={playNext}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
          title="Следующий трек"
        >
          <Icon name="SkipForward" size={16} className="text-gray-400 hover:text-primary transition-colors" />
        </button>

        <div 
          className="relative"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
            title="Громкость"
          >
            <Icon 
              name={volume === 0 ? 'VolumeX' : volume < 0.5 ? 'Volume1' : 'Volume2'} 
              size={16} 
              className="text-gray-400 hover:text-primary transition-colors" 
            />
          </button>
          
          {showVolume && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-2 shadow-xl">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="accent-primary cursor-pointer"
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