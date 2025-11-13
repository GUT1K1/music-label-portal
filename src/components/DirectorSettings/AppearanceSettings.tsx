import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AppearanceSettingsProps {
  userId: number;
}

export default function AppearanceSettings({ userId }: AppearanceSettingsProps) {
  const { currentTheme, setTheme, isLoading } = useTheme();
  const { toast } = useToast();
  const [changing, setChanging] = useState(false);

  const handleThemeChange = async (themeName: ThemeName) => {
    if (themeName === currentTheme) return;
    
    setChanging(true);
    try {
      await setTheme(themeName, userId);
      toast({
        title: 'Тема изменена',
        description: `Применена тема "${themes[themeName].displayName}"`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить тему',
        variant: 'destructive'
      });
    } finally {
      setChanging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Внешний вид</h2>
        <p className="text-white/70">
          Выберите цветовую тему для всего сайта. Изменения применятся мгновенно для всех пользователей.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(themes).map(([key, theme]) => {
          const isActive = currentTheme === key;
          const themeName = key as ThemeName;
          
          return (
            <Card
              key={key}
              className={`p-6 cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'ring-2 ring-primary shadow-lg shadow-primary/20'
                  : 'hover:ring-1 hover:ring-white/20'
              }`}
              onClick={() => handleThemeChange(themeName)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{theme.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{theme.displayName}</h3>
                    {isActive && (
                      <span className="text-xs text-primary flex items-center gap-1 mt-1">
                        <Icon name="Check" className="w-3 h-3" />
                        Активна
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md"
                    style={{ background: `hsl(${theme.colors.primary})` }}
                    title="Основной цвет"
                  />
                  <div
                    className="w-12 h-12 rounded-lg shadow-md"
                    style={{ background: `hsl(${theme.colors.secondary})` }}
                    title="Акцентный цвет"
                  />
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border border-white/10"
                    style={{ background: `hsl(${theme.colors.background})` }}
                    title="Фон"
                  />
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border border-white/10"
                    style={{ background: `hsl(${theme.colors.cardBg})` }}
                    title="Карточки"
                  />
                </div>

                {!isActive && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={changing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThemeChange(themeName);
                    }}
                  >
                    {changing ? 'Применяется...' : 'Применить тему'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-white/70">
            <p className="font-semibold text-white mb-1">Важно знать:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Тема применяется мгновенно для всех пользователей системы</li>
              <li>Изменить тему может только руководитель</li>
              <li>Настройка сохраняется в базе данных</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}