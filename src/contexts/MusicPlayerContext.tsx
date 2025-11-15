import { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  releaseId: number;
  trackId: number;
  trackName: string;
  artistName: string;
  coverUrl?: string;
  audioUrl: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  playRelease: (releaseId: number, tracks: Track[]) => void;
  pause: () => void;
  resume: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const playRelease = (releaseId: number, tracks: Track[]) => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, playRelease, pause, resume }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }
  return context;
}
