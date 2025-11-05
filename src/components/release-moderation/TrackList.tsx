import { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import type { Track } from './types';

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrackInfo = useMemo(() => tracks[currentTrack], [tracks, currentTrack]);

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
    if (audioRef.current) {
      audioRef.current.src = tracks[index].file_url;
      audioRef.current.play();
    }
  }, [tracks]);

  const handlePrevTrack = useCallback(() => {
    const newIndex = Math.max(0, currentTrack - 1);
    setCurrentTrack(newIndex);
    if (audioRef.current) {
      audioRef.current.src = tracks[newIndex].file_url;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack, tracks, isPlaying]);

  const handleNextTrack = useCallback(() => {
    const newIndex = Math.min(tracks.length - 1, currentTrack + 1);
    setCurrentTrack(newIndex);
    if (audioRef.current) {
      audioRef.current.src = tracks[newIndex].file_url;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack, tracks, isPlaying]);

  return (
    <div className="bg-gradient-to-br from-black via-yellow-950/20 to-black rounded-xl border border-yellow-500/20 p-4 md:p-6 space-y-4 shadow-xl shadow-yellow-500/5">
      <audio 
        ref={audioRef}
        src={currentTrackInfo?.file_url}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (currentTrack < tracks.length - 1) {
            handleNextTrack();
          } else {
            setIsPlaying(false);
          }
        }}
      />
      
      {/* Current Track Info */}
      {currentTrackInfo && (
        <div className="flex items-center gap-3 pb-4 border-b border-yellow-500/10">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
            <Icon name={isPlaying ? 'Music' : 'Disc'} size={24} className={`text-yellow-500 ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm md:text-base text-foreground truncate">{currentTrackInfo.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentTrackInfo.composer}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-yellow-500 font-medium">Трек {currentTrack + 1} из {tracks.length}</p>
          </div>
        </div>
      )}
      
      {/* Player Controls */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-600 [&_.bg-primary]:bg-yellow-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevTrack}
            disabled={currentTrack === 0}
            className="h-10 w-10 hover:bg-yellow-500/10 hover:text-yellow-500 disabled:opacity-30"
          >
            <Icon name="SkipBack" size={20} />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
            onClick={togglePlay}
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="text-black" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextTrack}
            disabled={currentTrack === tracks.length - 1}
            className="h-10 w-10 hover:bg-yellow-500/10 hover:text-yellow-500 disabled:opacity-30"
          >
            <Icon name="SkipForward" size={20} />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Список треков</h5>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`rounded-lg border transition-all ${
              currentTrack === index 
                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
                : 'bg-card border-border'
            }`}
          >
            <button
              onClick={() => playTrack(index)}
              className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left group hover:bg-yellow-500/5"
            >
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                {currentTrack === index && isPlaying ? (
                  <Icon name="Volume2" size={16} className="text-yellow-500 animate-pulse" />
                ) : (
                  <span className="text-xs font-bold text-yellow-500">{track.track_number}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{track.title}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {track.composer && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Music2" size={10} className="flex-shrink-0" />
                      {track.composer}
                    </p>
                  )}
                  {track.language_audio && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Languages" size={10} className="flex-shrink-0" />
                      {track.language_audio}
                    </p>
                  )}
                </div>
              </div>
              {currentTrack === index && (
                <Icon name="Music" size={16} className="text-yellow-500 flex-shrink-0" />
              )}
            </button>
            
            {(track.author_lyrics || track.lyrics_text) && (
              <div className="px-3 pb-3 pt-0 space-y-2 border-t border-yellow-500/10 mt-2">
                {track.author_lyrics && (
                  <div className="flex items-start gap-2">
                    <Icon name="PenTool" size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Автор текста</p>
                      <p className="text-xs font-medium">{track.author_lyrics}</p>
                    </div>
                  </div>
                )}
                {track.lyrics_text && (
                  <div className="flex items-start gap-2">
                    <Icon name="FileText" size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Текст песни</p>
                      <p className="text-xs whitespace-pre-wrap max-h-24 overflow-y-auto">{track.lyrics_text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}