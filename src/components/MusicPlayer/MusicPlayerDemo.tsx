import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import PlayerVariantA from './PlayerVariantA';
import PlayerVariantB from './PlayerVariantB';
import PlayerVariantC from './PlayerVariantC';
import PlayerVariantD from './PlayerVariantD';

interface Track {
  releaseId: number;
  trackId: number;
  trackName: string;
  artistName: string;
  coverUrl?: string;
  audioUrl: string;
}

interface MusicPlayerDemoProps {
  userId: number;
}

type PlayerVariant = 'A' | 'B' | 'C' | 'D';

export default function MusicPlayerDemo({ userId }: MusicPlayerDemoProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [variant, setVariant] = useState<PlayerVariant>('A');
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    loadTracks();
    const interval = setInterval(loadTracks, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadTracks = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.RELEASES}?status=approved&limit=50`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      
      if (response.ok) {
        const releases = await response.json();
        const releasesArray = Array.isArray(releases) ? releases : [];
        const allTracks: Track[] = [];
        
        for (const release of releasesArray) {
          const releaseDetailResponse = await fetch(
            `${API_ENDPOINTS.RELEASES}?release_id=${release.id}`,
            { headers: { 'X-User-Id': userId.toString() } }
          );
          
          if (releaseDetailResponse.ok) {
            const releaseDetail = await releaseDetailResponse.json();
            const releaseTracks = releaseDetail.tracks || [];
            
            for (const track of releaseTracks) {
              const audioUrl = track.audio_url || track.file_url;
              if (audioUrl) {
                allTracks.push({
                  releaseId: release.id,
                  trackId: track.id,
                  trackName: track.track_name || track.title || 'Без названия',
                  artistName: release.artist_name,
                  coverUrl: release.cover_url,
                  audioUrl: audioUrl
                });
              }
            }
          }
        }
        
        setTracks(allTracks);
      }
    } catch (error) {
      console.error('[MusicPlayerDemo] Failed to load tracks:', error);
    }
  };

  if (tracks.length === 0) return null;

  const variants = {
    A: <PlayerVariantA tracks={tracks} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />,
    B: <PlayerVariantB tracks={tracks} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />,
    C: <PlayerVariantC tracks={tracks} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />,
    D: <PlayerVariantD tracks={tracks} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />
  };

  return (
    <>
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="fixed bottom-24 right-6 z-[60] p-3 bg-primary hover:bg-primary/90 rounded-full shadow-2xl transition-all hover:scale-110"
        title="Выбрать дизайн плеера"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
          <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {showSelector && (
        <div className="fixed bottom-40 right-6 z-[60] bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl">
          <div className="text-sm font-semibold text-white mb-3">Выбери вариант плеера:</div>
          <div className="flex flex-col gap-2">
            {(['A', 'B', 'C', 'D'] as PlayerVariant[]).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setVariant(v);
                  setShowSelector(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  variant === v
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Вариант {v} {v === 'A' && '(Spotify)'}
                {v === 'B' && '(Минимал)'}
                {v === 'C' && '(YouTube)'}
                {v === 'D' && '(Glass)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {variants[variant]}
    </>
  );
}
