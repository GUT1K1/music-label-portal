import { useState } from 'react';
import Icon from '@/components/ui/icon';
import MenuVariation1 from './MenuVariation1';
import MenuVariation2 from './MenuVariation2';
import MenuVariation3 from './MenuVariation3';
import MenuVariation4 from './MenuVariation4';

/**
 * Витрина всех вариантов меню
 * Позволяет переключаться между вариантами
 */

export default function MenuShowcase() {
  const [activeVariation, setActiveVariation] = useState(1);

  const variations = [
    {
      id: 1,
      name: 'Боковая панель',
      icon: 'PanelLeft',
      color: 'blue',
      description: 'Вертикальная панель слева'
    },
    {
      id: 2,
      name: 'Нижняя панель',
      icon: 'PanelBottom',
      color: 'green',
      description: 'Навигация снизу как в мобильных'
    },
    {
      id: 3,
      name: 'Горизонтальные табы',
      icon: 'LayoutGrid',
      color: 'yellow',
      description: 'Табы в шапке сайта'
    },
    {
      id: 4,
      name: 'Компактный сайдбар',
      icon: 'Sidebar',
      color: 'purple',
      description: 'Узкая панель с иконками'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Панель выбора вариантов */}
      <div className="fixed top-4 right-4 z-50 bg-card/95 backdrop-blur-lg border border-border rounded-2xl p-4 shadow-2xl max-w-xs">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Icon name="Layers" className="w-5 h-5 text-primary" />
          Выбери вариант меню
        </h3>
        
        <div className="space-y-2">
          {variations.map((variation) => (
            <button
              key={variation.id}
              onClick={() => setActiveVariation(variation.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                activeVariation === variation.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-card/50 border border-border hover:border-primary/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                variation.color === 'blue' ? 'bg-blue-500/20' :
                variation.color === 'green' ? 'bg-green-500/20' :
                variation.color === 'yellow' ? 'bg-yellow-500/20' :
                'bg-purple-500/20'
              }`}>
                <Icon name={variation.icon as any} className={`w-5 h-5 ${
                  variation.color === 'blue' ? 'text-blue-400' :
                  variation.color === 'green' ? 'text-green-400' :
                  variation.color === 'yellow' ? 'text-yellow-400' :
                  'text-purple-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{variation.name}</div>
                <div className="text-xs text-muted-foreground">{variation.description}</div>
              </div>
              {activeVariation === variation.id && (
                <Icon name="CheckCircle2" className="w-5 h-5 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 Подсказка: наведи курсор на элементы меню в варианте 4, чтобы увидеть подсказки
          </p>
        </div>
      </div>

      {/* Показываем выбранный вариант */}
      <div className="transition-opacity duration-300">
        {activeVariation === 1 && <MenuVariation1 />}
        {activeVariation === 2 && <MenuVariation2 />}
        {activeVariation === 3 && <MenuVariation3 />}
        {activeVariation === 4 && <MenuVariation4 />}
      </div>
    </div>
  );
}
