import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
  { name: 'Яндекс Музыка', plays: 3927, icon: '🎵', color: 'from-yellow-500 to-red-500', bgColor: 'bg-yellow-500/10' },
  { name: 'VK Музыка', plays: 247, icon: '🎧', color: 'from-blue-500 to-purple-600', bgColor: 'bg-blue-500/10' },
  { name: 'TikTok', plays: 79272, icon: '🎬', color: 'from-cyan-400 to-pink-500', bgColor: 'bg-cyan-500/10' },
  { name: 'МТС Музыка', plays: 351, icon: '📱', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-500/10' },
  { name: 'Spotify', plays: 19, icon: '🎶', color: 'from-green-400 to-emerald-600', bgColor: 'bg-green-500/10' },
  { name: 'СберЗвук', plays: 3, icon: '🔊', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/10' },
];

const releases = [
  { id: 1, title: 'Ночи бессонные', artist: 'LXE / GUTIK', cover: '🎵' },
  { id: 2, title: 'Летний вайб', artist: 'MC FLAME', cover: '🌅' },
  { id: 3, title: 'В тумане', artist: 'SHADOW', cover: '🌫️' },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'halfyear'>('week');
  const [selectedRelease, setSelectedRelease] = useState(releases[0].id);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-primary hover:text-primary/80"
        >
          <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Аналитика
          </h1>
          <p className="text-gray-400">Отслеживайте статистику ваших релизов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Полгода</span>
              <Icon name="Info" className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white">168 862</div>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Месяц</span>
              <Icon name="Info" className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white">25 573</div>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Сутки</span>
              <Icon name="Info" className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white">89</div>
          </div>
        </div>

        <div className="relative p-6 md:p-8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">По выбранному релизу</span>
                <Icon name="Info" className="w-4 h-4 text-gray-500" />
              </div>
              <select
                value={selectedRelease}
                onChange={(e) => setSelectedRelease(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500/50 transition-colors"
              >
                {releases.map((release) => (
                  <option key={release.id} value={release.id} className="bg-black">
                    {release.artist} - {release.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
                className={selectedPeriod === 'week' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' : 'border-white/10 text-gray-400'}
              >
                За неделю
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
                className={selectedPeriod === 'month' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' : 'border-white/10 text-gray-400'}
              >
                За месяц
              </Button>
              <Button
                variant={selectedPeriod === 'halfyear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('halfyear')}
                className={selectedPeriod === 'halfyear' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' : 'border-white/10 text-gray-400'}
              >
                За полгода
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-4 text-sm mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                <span className="text-gray-300">Прослушивания</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                <span className="text-gray-300">Лайки</span>
              </label>
            </div>
          </div>

          <div className="h-[300px] md:h-[400px] w-full">
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
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{ fill: '#999' }}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="plays"
                  stroke="#f97316"
                  strokeWidth={3}
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
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Статистика по площадкам</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformStats.map((platform, i) => (
              <div
                key={i}
                className={`relative p-6 ${platform.bgColor} backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-orange-500/30 transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">{platform.name}</div>
                    <div className="text-3xl font-bold text-white">{platform.plays.toLocaleString()}</div>
                  </div>
                  <div className="text-4xl">{platform.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
