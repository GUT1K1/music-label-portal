import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WizardStepReleaseTypeProps {
  releaseType: 'single' | 'maxi-single' | 'ep' | 'album' | null;
  onSelect: (type: 'single' | 'maxi-single' | 'ep' | 'album') => void;
}

const RELEASE_TYPES = [
  {
    id: 'single' as const,
    title: 'Сингл',
    subtitle: '1 трек',
    description: 'Один основной трек',
    icon: 'Music',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30 hover:border-blue-500'
  },
  {
    id: 'maxi-single' as const,
    title: 'Макси-сингл',
    subtitle: '3 трека',
    description: 'Сингл с дополнительными версиями или би-сайдами',
    icon: 'Music2',
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30 hover:border-green-500'
  },
  {
    id: 'ep' as const,
    title: 'EP',
    subtitle: '4-6 треков',
    description: 'Мини-альбом, больше сингла но меньше альбома',
    icon: 'ListMusic',
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30 hover:border-orange-500'
  },
  {
    id: 'album' as const,
    title: 'Альбом',
    subtitle: '7+ треков',
    description: 'Полноценный альбом с множеством композиций',
    icon: 'Disc3',
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30 hover:border-purple-500'
  }
];

export default function WizardStepReleaseType({ releaseType, onSelect }: WizardStepReleaseTypeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Что загружаем?</h2>
        <p className="text-sm text-muted-foreground">Выберите тип вашего релиза</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {RELEASE_TYPES.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:scale-[1.02] ${
              releaseType === type.id 
                ? `bg-gradient-to-br ${type.gradient} border-2 ${type.border.replace('hover:', '')}` 
                : `hover:shadow-lg border-2 ${type.border}`
            }`}
            onClick={() => onSelect(type.id)}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  releaseType === type.id ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon name={type.icon} size={24} className={releaseType === type.id ? 'text-primary' : ''} />
                </div>
                {releaseType === type.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{type.title}</h3>
                <p className="text-xs font-medium text-muted-foreground">{type.subtitle}</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {type.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="AlertTriangle" size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Внимание!</p>
            <p className="text-xs text-muted-foreground">
              По закону РФ запрещена дистрибуция треков с наркоматематикой. 
              Применяется только clean версия без упоминаний запрещённых веществ.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="font-medium">Куда загружается релиз?</div>
        <p className="text-muted-foreground leading-relaxed">
          Apple Music, iTunes, Spotify, ВКонтакте, Вконтакте Музыка, Яндекс Музыка, Tik Tok, YouTube, Content ID, Deezer, Shazam, Сбарзвук и др.
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="font-medium">В каком виде статистика?</div>
        <p className="text-muted-foreground leading-relaxed">
          В личном кабинете доступна ежедневная статистика по самым популярным площадкам и детализация по аудиториям.
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="font-medium">Какие финансовые условия?</div>
        <p className="text-muted-foreground leading-relaxed">
          Вы будете получать 90% прибыли. Вывод средств доступен при накоплении минимального баланса в 2000 рублей.
        </p>
      </div>
    </div>
  );
}