import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { API_URL } from './types';

interface Track {
  track_number: number;
  title: string;
  composer: string;
  author_phonogram?: string;
  file_url?: string;
  language_audio: string;
}

interface ReleasePlayerProps {
  userId: number;
  releaseId: number;
}

export default function ReleasePlayer({ userId, releaseId }: ReleasePlayerProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadTracks();
  }, [releaseId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
    };

    audio.addEventListener('timeupdate', updateTime, { passive: true });
    audio.addEventListener('loadedmetadata', updateDuration, { passive: true });
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    if (audioRef.current && tracks[currentTrack]?.file_url) {
      audioRef.current.src = tracks[currentTrack].file_url!;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, tracks]);

  const loadTracks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?release_id=${releaseId}`, {
        headers: {
          'X-User-Id': String(userId)
        }
      });
      
      if (!response.ok) {
        setTracks([]);
        return;
      }
      
      const data = await response.json();
      const tracksArray = Array.isArray(data) ? data : (data.tracks || []);
      setTracks(tracksArray);
    } catch (error) {
      console.error('Failed to load tracks:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [userId, releaseId]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const playTrack = useCallback((index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  }, []);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrack(Math.max(0, currentTrack - 1));
  }, [currentTrack]);

  const handleNextTrack = useCallback(() => {
    setCurrentTrack(Math.min(tracks.length - 1, currentTrack + 1));
  }, [currentTrack, tracks.length]);

  const currentTrackInfo = useMemo(() => tracks[currentTrack], [tracks, currentTrack]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-3 bg-muted/30 rounded">
        <Icon name="Loader2" size={16} className="animate-spin" />
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-3 text-muted-foreground bg-muted/30 rounded">
        <p className="text-xs">Треки не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded p-3 space-y-2 border border-border/50">
      <audio ref={audioRef} />
      
      {/* Compact Player Controls */}
      <div className="space-y-2">
        {/* Current Track */}
        {currentTrackInfo && (
          <div className="flex items-center gap-2">
            <Icon name={isPlaying ? 'Music' : 'Disc'} size={14} className={`text-primary flex-shrink-0 ${isPlaying ? 'animate-pulse' : ''}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentTrackInfo.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{currentTrackInfo.composer}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{currentTrack + 1}/{tracks.length}</span>
          </div>
        )}
        
        {/* Progress */}
        <div className="space-y-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer h-1"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevTrack}
            disabled={currentTrack === 0}
            className="h-7 w-7"
          >
            <Icon name="SkipBack" size={14} />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextTrack}
            disabled={currentTrack === tracks.length - 1}
            className="h-7 w-7"
          >
            <Icon name="SkipForward" size={14} />
          </Button>
        </div>
      </div>

      {/* Compact Track List */}
      {tracks.length > 1 && (
        <div className="space-y-0.5 max-h-32 overflow-y-auto">
          {tracks.map((track, index) => (
            <button
              key={track.track_number}
              onClick={() => playTrack(index)}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors text-xs ${
                currentTrack === index 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-[10px] text-muted-foreground w-4">{track.track_number}</span>
              <Icon 
                name={currentTrack === index && isPlaying ? 'Volume2' : 'Music'} 
                size={10} 
                className="flex-shrink-0"
              />
              <span className="flex-1 truncate">{track.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
