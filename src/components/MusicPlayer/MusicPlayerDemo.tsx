import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
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

export default function MusicPlayerDemo({ userId }: MusicPlayerDemoProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return <PlayerVariantD tracks={tracks} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />;
}