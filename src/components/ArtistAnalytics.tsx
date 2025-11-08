import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Platform = 'yandex' | 'vk' | 'tiktok' | 'mts' | 'spotify' | 'sber';

const platformData = {
  yandex: [
    { date: '05.05', plays: 520 },
    { date: '06.05', plays: 480 },
    { date: '07.05', plays: 610 },
    { date: '08.05', plays: 680 },
    { date: '09.05', plays: 540 },
    { date: '10.05', plays: 590 },
    { date: '11.05', plays: 510 },
    { date: '12.05', plays: 450 },
  ],
  vk: [
    { date: '05.05', plays: 35 },
    { date: '06.05', plays: 42 },
    { date: '07.05', plays: 38 },
    { date: '08.05', plays: 51 },
    { date: '09.05', plays: 45 },
    { date: '10.05', plays: 39 },
    { date: '11.05', plays: 33 },
    { date: '12.05', plays: 28 },
  ],
  tiktok: [
    { date: '05.05', creations: 46, views: 13000, comments: 56, likes: 450, shares: 121, favorites: 28 },
    { date: '06.05', creations: 38, views: 11500, comments: 42, likes: 380, shares: 95, favorites: 22 },
    { date: '07.05', creations: 52, views: 15000, comments: 68, likes: 520, shares: 142, favorites: 35 },
    { date: '08.05', creations: 61, views: 16200, comments: 73, likes: 610, shares: 158, favorites: 41 },
    { date: '09.05', creations: 44, views: 12800, comments: 51, likes: 440, shares: 108, favorites: 26 },
    { date: '10.05', creations: 41, views: 12300, comments: 48, likes: 390, shares: 102, favorites: 24 },
    { date: '11.05', creations: 29, views: 8200, comments: 33, likes: 280, shares: 68, favorites: 16 },
    { date: '12.05', creations: 12, views: 2100, comments: 14, likes: 95, shares: 28, favorites: 7 },
  ],
  mts: [
    { date: '05.05', plays: 48 },
    { date: '06.05', plays: 52 },
    { date: '07.05', plays: 45 },
    { date: '08.05', plays: 61 },
    { date: '09.05', plays: 55 },
    { date: '10.05', plays: 49 },
    { date: '11.05', plays: 42 },
    { date: '12.05', plays: 38 },
  ],
  spotify: [
    { date: '05.05', plays: 2 },
    { date: '06.05', plays: 3 },
    { date: '07.05', plays: 4 },
    { date: '08.05', plays: 3 },
    { date: '09.05', plays: 2 },
    { date: '10.05', plays: 3 },
    { date: '11.05', plays: 1 },
    { date: '12.05', plays: 1 },
  ],
  sber: [
    { date: '05.05', plays: 0 },
    { date: '06.05', plays: 1 },
    { date: '07.05', plays: 0 },
    { date: '08.05', plays: 1 },
    { date: '09.05', plays: 0 },
    { date: '10.05', plays: 0 },
    { date: '11.05', plays: 1 },
    { date: '12.05', plays: 0 },
  ],
};

const platformStats = [
  { id: 'yandex' as Platform, name: 'Яндекс Музыка', plays: 3927, icon: '🎵', bgColor: 'bg-yellow-500/10' },
  { id: 'vk' as Platform, name: 'VK Музыка', plays: 247, icon: '🎧', bgColor: 'bg-blue-500/10' },
  { id: 'tiktok' as Platform, name: 'TikTok', plays: 79272, icon: '🎬', bgColor: 'bg-cyan-500/10' },
  { id: 'mts' as Platform, name: 'МТС Музыка', plays: 351, icon: '📱', bgColor: 'bg-red-500/10' },
  { id: 'spotify' as Platform, name: 'Spotify', plays: 19, icon: '🎶', bgColor: 'bg-green-500/10' },
  { id: 'sber' as Platform, name: 'СберЗвук', plays: 3, icon: '🔊', bgColor: 'bg-emerald-500/10' },
];

const releases = [
  { id: 1, title: 'Ночи бессонные', artist: 'LXE / GUTIK' },
  { id: 2, title: 'Летний вайб', artist: 'MC FLAME' },
  { id: 3, title: 'В тумане', artist: 'SHADOW' },
];

const tiktokMetrics = [
  { key: 'creations' as const, label: 'Создания', color: '#ff6b6b' },
  { key: 'views' as const, label: 'Просмотры', color: '#f97316' },
  { key: 'comments' as const, label: 'Комментарии', color: '#fbbf24' },
  { key: 'likes' as const, label: 'Лайки', color: '#06b6d4' },
  { key: 'shares' as const, label: 'Поделились', color: '#a78bfa' },
  { key: 'favorites' as const, label: 'Избранное', color: '#34d399' },
];

export default function ArtistAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'halfyear'>('week');
  const [selectedRelease, setSelectedRelease] = useState(releases[0].id);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('yandex');
  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
    creations: true,
    views: true,
    comments: true,
    likes: true,
    shares: true,
    favorites: true,
  });

  const currentData = platformData[selectedPlatform];
  const isTikTok = selectedPlatform === 'tiktok';

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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs md:text-sm text-gray-400">По выбранному релизу</span>
              <Icon name="Info" className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </div>
            <select
              value={selectedRelease}
              onChange={(e) => setSelectedRelease(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            >
              {releases.map((release) => (
                <option key={release.id} value={release.id} className="bg-black">
                  {release.artist} - {release.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
              className={`text-xs whitespace-nowrap ${selectedPeriod === 'week' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600' : 'border-border text-gray-400'}`}
            >
              Неделя
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
              className={`text-xs whitespace-nowrap ${selectedPeriod === 'month' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600' : 'border-border text-gray-400'}`}
            >
              Месяц
            </Button>
            <Button
              variant={selectedPeriod === 'halfyear' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('halfyear')}
              className={`text-xs whitespace-nowrap ${selectedPeriod === 'halfyear' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600' : 'border-border text-gray-400'}`}
            >
              Полгода
            </Button>
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