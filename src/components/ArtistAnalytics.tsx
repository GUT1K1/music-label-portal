import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Release } from './releases/types';
import { API_ENDPOINTS } from '@/config/api';

type Platform = 'yandex' | 'vk' | 'tiktok' | 'mts' | 'spotify' | 'sber';
type Period = 'week' | 'month' | 'halfyear' | 'year';

const generatePlatformData = (period: Period, platform: Platform) => {
  const baseMultipliers = {
    yandex: 1,
    vk: 0.07,
    tiktok: 25,
    mts: 0.08,
    spotify: 0.004,
    sber: 0.001
  };

  const multiplier = baseMultipliers[platform];

  if (platform === 'tiktok') {
    const configs = {
      week: { points: 7, baseViews: 2000 },
      month: { points: 30, baseViews: 500 },
      halfyear: { points: 26, baseViews: 3000 },
      year: { points: 52, baseViews: 3500 }
    };
    const config = configs[period];
    return Array.from({ length: config.points }, (_, i) => ({
      date: period === 'year' ? `Нед ${i + 1}` : period === 'halfyear' ? `${i + 1} нед` : `${String(i + 1).padStart(2, '0')}.11`,
      creations: Math.floor(30 + Math.random() * 40),
      views: Math.floor(config.baseViews + Math.random() * 5000 + Math.sin(i / 2) * 3000),
      comments: Math.floor(40 + Math.random() * 40),
      likes: Math.floor(300 + Math.random() * 400),
      shares: Math.floor(80 + Math.random() * 100),
      favorites: Math.floor(15 + Math.random() * 30)
    }));
  }

  const configs = {
    week: { points: 7, base: 500 },
    month: { points: 30, base: 150 },
    halfyear: { points: 26, base: 600 },
    year: { points: 52, base: 650 }
  };
  const config = configs[period];

  return Array.from({ length: config.points }, (_, i) => ({
    date: period === 'year' ? `Нед ${i + 1}` : period === 'halfyear' ? `${i + 1} нед` : `${String(i + 1).padStart(2, '0')}.11`,
    plays: Math.floor((config.base + Math.random() * 200 + Math.sin(i / 2) * 100) * multiplier)
  }));
};

const platformStats = [
  { id: 'yandex' as Platform, name: 'Яндекс Музыка', plays: 3927, icon: '🎵', bgColor: 'bg-yellow-500/10' },
  { id: 'vk' as Platform, name: 'VK Музыка', plays: 247, icon: '🎧', bgColor: 'bg-blue-500/10' },
  { id: 'tiktok' as Platform, name: 'TikTok', plays: 79272, icon: '🎬', bgColor: 'bg-cyan-500/10' },
  { id: 'mts' as Platform, name: 'МТС Музыка', plays: 351, icon: '📱', bgColor: 'bg-red-500/10' },
  { id: 'spotify' as Platform, name: 'Spotify', plays: 19, icon: '🎶', bgColor: 'bg-green-500/10' },
  { id: 'sber' as Platform, name: 'СберЗвук', plays: 3, icon: '🔊', bgColor: 'bg-emerald-500/10' },
];



const tiktokMetrics = [
  { key: 'creations' as const, label: 'Создания', color: '#ff6b6b' },
  { key: 'views' as const, label: 'Просмотры', color: '#f97316' },
  { key: 'comments' as const, label: 'Комментарии', color: '#fbbf24' },
  { key: 'likes' as const, label: 'Лайки', color: '#06b6d4' },
  { key: 'shares' as const, label: 'Поделились', color: '#a78bfa' },
  { key: 'favorites' as const, label: 'Избранное', color: '#34d399' },
];

interface ArtistAnalyticsProps {
  userId: number;
}

const periodOptions = [
  { id: 'week' as Period, label: 'За неделю', icon: 'Calendar' },
  { id: 'month' as Period, label: 'За месяц', icon: 'CalendarDays' },
  { id: 'halfyear' as Period, label: 'За полгода', icon: 'CalendarRange' },
  { id: 'year' as Period, label: 'За год', icon: 'CalendarClock' }
];

export default function ArtistAnalytics({ userId }: ArtistAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('yandex');
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReleaseSelector, setShowReleaseSelector] = useState(false);
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);
  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
    creations: true,
    views: true,
    comments: true,
    likes: true,
    shares: true,
    favorites: true,
  });

  useEffect(() => {
    const loadReleases = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.RELEASES, {
          headers: { 'X-User-Id': userId.toString() }
        });
        if (!response.ok) throw new Error('Failed to load releases');
        const data = await response.json();
        setReleases(data);
        if (data.length > 0) {
          setSelectedRelease(data[0].id);
        }
      } catch (error) {
        console.error('Error loading releases:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReleases();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showReleaseSelector && !target.closest('.release-selector-container')) {
        setShowReleaseSelector(false);
      }
      if (showPeriodSelector && !target.closest('.period-selector-container')) {
        setShowPeriodSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReleaseSelector, showPeriodSelector]);

  const currentData = generatePlatformData(selectedPeriod, selectedPlatform);
  const isTikTok = selectedPlatform === 'tiktok';
  const currentRelease = releases.find(r => r.id === selectedRelease);
  const currentPeriodOption = periodOptions.find(p => p.id === selectedPeriod);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Icon name="BarChart3" size={64} className="text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Нет релизов</h3>
        <p className="text-gray-400">Загрузите первый релиз, чтобы увидеть аналитику</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="relative p-4 md:p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-400">Полгода</span>
            <Icon name="Info" className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white">168 862</div>
        </div>

        <div className="relative p-4 md:p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-400">Месяц</span>
            <Icon name="Info" className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white">25 573</div>
        </div>

        <div className="relative p-4 md:p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-gray-400">Сутки</span>
            <Icon name="Info" className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white">89</div>
        </div>
      </div>

      <div className="relative p-4 md:p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-3">
          <div className="flex-1 relative release-selector-container">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs md:text-sm text-gray-400">По выбранному релизу</span>
              <Icon name="Info" className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </div>
            <button
              onClick={() => setShowReleaseSelector(!showReleaseSelector)}
              className="w-full bg-card/60 border border-border rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-primary/50 transition-all group"
            >
              {currentRelease ? (
                <div className="flex items-center gap-3">
                  {currentRelease.cover_url ? (
                    <img
                      src={currentRelease.cover_url}
                      alt={currentRelease.release_name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <Icon name="Music" className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{currentRelease.release_name}</div>
                    <div className="text-xs text-gray-400">{currentRelease.artist_name || 'Без имени'}</div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">Выберите релиз</span>
              )}
              <Icon
                name={showReleaseSelector ? 'ChevronUp' : 'ChevronDown'}
                className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors"
              />
            </button>
            
            {showReleaseSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 max-h-[300px] overflow-y-auto">
                {releases.map((release) => (
                  <button
                    key={release.id}
                    onClick={() => {
                      setSelectedRelease(release.id);
                      setShowReleaseSelector(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                      selectedRelease === release.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    {release.cover_url ? (
                      <img
                        src={release.cover_url}
                        alt={release.release_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="Music" className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">{release.release_name}</div>
                      <div className="text-xs text-gray-400">{release.artist_name || 'Без имени'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {release.tracks_count || 0} {release.tracks_count === 1 ? 'трек' : 'треков'}
                      </div>
                    </div>
                    {selectedRelease === release.id && (
                      <Icon name="Check" className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative period-selector-container min-w-[180px]">
            <button
              onClick={() => setShowPeriodSelector(!showPeriodSelector)}
              className="w-full bg-card/60 border border-border rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-primary/50 transition-all group"
            >
              {currentPeriodOption ? (
                <div className="flex items-center gap-3">
                  <Icon name={currentPeriodOption.icon} className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-white">{currentPeriodOption.label}</span>
                </div>
              ) : (
                <span className="text-gray-400">Выберите период</span>
              )}
              <Icon
                name={showPeriodSelector ? 'ChevronUp' : 'ChevronDown'}
                className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors"
              />
            </button>
            
            {showPeriodSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50">
                {periodOptions.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => {
                      setSelectedPeriod(period.id);
                      setShowPeriodSelector(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      selectedPeriod === period.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <Icon name={period.icon} className="w-5 h-5 text-primary" />
                    <span className="flex-1 text-left text-sm font-medium text-white">{period.label}</span>
                    {selectedPeriod === period.id && (
                      <Icon name="Check" className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isTikTok && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-3 text-xs mb-3">
              {tiktokMetrics.map((metric) => (
                <label key={metric.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleMetrics[metric.key]}
                    onChange={(e) => setVisibleMetrics({ ...visibleMetrics, [metric.key]: e.target.checked })}
                    className="w-3 h-3"
                    style={{ accentColor: metric.color }}
                  />
                  <span className="text-gray-300">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <defs>
                {isTikTok ? (
                  tiktokMetrics.map((metric) => (
                    <linearGradient key={metric.key} id={`color${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={metric.color} stopOpacity={0}/>
                    </linearGradient>
                  ))
                ) : (
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                tick={{ fill: '#999' }}
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#999' }}
                style={{ fontSize: '10px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              {isTikTok ? (
                tiktokMetrics
                  .filter((metric) => visibleMetrics[metric.key])
                  .map((metric) => (
                    <Area
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      stroke={metric.color}
                      strokeWidth={2}
                      fill={`url(#color${metric.key})`}
                      name={metric.label}
                    />
                  ))
              ) : (
                <Area
                  type="monotone"
                  dataKey="plays"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorPlays)"
                  name="Прослушивания"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-base md:text-xl font-bold mb-3 text-white">Статистика по площадкам</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {platformStats.map((platform, i) => (
            <button
              key={i}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`relative p-4 ${platform.bgColor} backdrop-blur-sm rounded-xl border transition-all duration-300 text-left w-full ${
                selectedPlatform === platform.id
                  ? 'border-primary/70 ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{platform.icon}</span>
                {selectedPlatform === platform.id ? (
                  <Icon name="Check" className="w-4 h-4 text-primary" />
                ) : (
                  <Icon name="TrendingUp" className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="text-xs text-gray-400 mb-1">{platform.name}</div>
              <div className="text-xl md:text-2xl font-bold text-white">{platform.plays.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}