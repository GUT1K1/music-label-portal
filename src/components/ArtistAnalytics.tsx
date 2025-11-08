import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '05.05', plays: 13000, likes: 450 },
  { date: '06.05', plays: 11500, likes: 380 },
  { date: '07.05', plays: 15000, likes: 520 },
  { date: '08.05', plays: 16200, likes: 610 },
  { date: '09.05', plays: 12800, likes: 440 },
  { date: '10.05', plays: 12300, likes: 390 },
  { date: '11.05', plays: 8200, likes: 280 },
  { date: '12.05', plays: 2100, likes: 95 },
];

const platformStats = [
  { name: 'Яндекс Музыка', plays: 3927, icon: '🎵', bgColor: 'bg-yellow-500/10' },
  { name: 'VK Музыка', plays: 247, icon: '🎧', bgColor: 'bg-blue-500/10' },
  { name: 'TikTok', plays: 79272, icon: '🎬', bgColor: 'bg-cyan-500/10' },
  { name: 'МТС Музыка', plays: 351, icon: '📱', bgColor: 'bg-red-500/10' },
  { name: 'Spotify', plays: 19, icon: '🎶', bgColor: 'bg-green-500/10' },
  { name: 'СберЗвук', plays: 3, icon: '🔊', bgColor: 'bg-emerald-500/10' },
];

const releases = [
  { id: 1, title: 'Ночи бессонные', artist: 'LXE / GUTIK' },
  { id: 2, title: 'Летний вайб', artist: 'MC FLAME' },
  { id: 3, title: 'В тумане', artist: 'SHADOW' },
];

export default function ArtistAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'halfyear'>('week');
  const [selectedRelease, setSelectedRelease] = useState(releases[0].id);

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

        <div className="mb-3">
          <div className="flex gap-3 text-xs mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3 h-3 accent-orange-500" />
              <span className="text-gray-300">Прослушивания</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3 h-3 accent-cyan-500" />
              <span className="text-gray-300">Лайки</span>
            </label>
          </div>
        </div>

        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
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
              <Area
                type="monotone"
                dataKey="plays"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorPlays)"
                name="Прослушивания"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#colorLikes)"
                name="Лайки"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-base md:text-xl font-bold mb-3 text-white">Статистика по площадкам</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {platformStats.map((platform, i) => (
            <div
              key={i}
              className={`relative p-4 ${platform.bgColor} backdrop-blur-sm rounded-xl border border-border group hover:border-primary/30 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{platform.name}</div>
                  <div className="text-xl md:text-2xl font-bold text-white">{platform.plays.toLocaleString()}</div>
                </div>
                <div className="text-2xl md:text-3xl">{platform.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
