import { useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import PlayerVariantD from './PlayerVariantD';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface MusicPlayerDemoProps {
  userId: number;
}

export default function MusicPlayerDemo({ userId }: MusicPlayerDemoProps) {
  const { currentTrack } = useMusicPlayer();

  // Загружаем популярные треки только если пользователь сам ничего не включил
  useEffect(() => {
    if (!currentTrack) {
      // Можно загрузить рекомендуемые треки, но пока просто ждём пока пользователь сам выберет
    }
  }, [userId, currentTrack]);

  // Показываем плеер только если есть трек для воспроизведения
  if (!currentTrack) return null;

  return <PlayerVariantD />;
}
