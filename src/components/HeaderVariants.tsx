import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Variant1 from '@/components/header-variants/Variant1';
import Variant2 from '@/components/header-variants/Variant2';
import Variant3 from '@/components/header-variants/Variant3';
import Variant4 from '@/components/header-variants/Variant4';
import Variant5 from '@/components/header-variants/Variant5';
import Variant6 from '@/components/header-variants/Variant6';
import Variant7 from '@/components/header-variants/Variant7';
import Variant8 from '@/components/header-variants/Variant8';
import Variant9 from '@/components/header-variants/Variant9';
import Variant10 from '@/components/header-variants/Variant10';

const balance = 1234.56;
const notifications = 3;
const userName = 'Иван Иванов';
const userRole = 'Руководитель';

export default function HeaderVariants() {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const variants = [
    {
      id: 1,
      name: 'Avatar Dropdown Menu',
      description: 'Баланс + колокольчик + аватар с выпадающим меню',
      component: <Variant1 balance={balance} notifications={notifications} userName={userName} />,
    },
    {
      id: 2,
      name: 'Compact Card Popup',
      description: 'Только иконки, клик на аватар открывает карточку',
      component: <Variant2 balance={balance} notifications={notifications} userName={userName} userRole={userRole} />,
    },
    {
      id: 3,
      name: 'Username + Settings Icon',
      description: 'Username вместо кнопок + иконка настроек',
      component: <Variant3 balance={balance} notifications={notifications} userName={userName} />,
    },
    {
      id: 4,
      name: 'Status Badge Style',
      description: 'Зеленая точка онлайн + имя',
      component: <Variant4 balance={balance} notifications={notifications} userName={userName} />,
    },
    {
      id: 5,
      name: 'Three Dots Menu',
      description: 'Аватар + три точки меню',
      component: <Variant5 balance={balance} notifications={notifications} />,
    },
    {
      id: 6,
      name: 'Profile Chip Extended',
      description: 'Chip с аватаром, именем и ролью',
      component: <Variant6 balance={balance} notifications={notifications} userName={userName} userRole={userRole} />,
    },
    {
      id: 7,
      name: 'Minimalist Icons Only',
      description: 'Максимально компактно - только иконки',
      component: <Variant7 balance={balance} notifications={notifications} />,
    },
    {
      id: 8,
      name: 'Icon Group Compact',
      description: 'Все иконки действий группой + аватар',
      component: <Variant8 balance={balance} notifications={notifications} />,
    },
    {
      id: 9,
      name: 'Inline Compact',
      description: 'Все элементы в одной линии через точки',
      component: <Variant9 balance={balance} notifications={notifications} userName={userName} />,
    },
    {
      id: 10,
      name: 'Glassmorphism Style',
      description: 'Стеклянный эффект с минимализмом',
      component: <Variant10 balance={balance} notifications={notifications} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary animate-shimmer">10 вариантов шапки</h1>
          <p className="text-muted-foreground">Выберите понравившийся вариант</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                selectedVariant === variant.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/50">
                      #{variant.id}
                    </Badge>
                    {variant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
                </div>
                {selectedVariant === variant.id && (
                  <Badge className="bg-primary">
                    <Icon name="Check" size={14} className="mr-1" />
                    Выбрано
                  </Badge>
                )}
              </div>
              <div className="flex justify-end p-4 bg-background/50 rounded-lg border border-border">
                {variant.component}
              </div>
            </div>
          ))}
        </div>

        {selectedVariant && (
          <div className="fixed bottom-8 right-8 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg shadow-primary/50 flex items-center gap-2 animate-slideIn">
            <Icon name="Check" size={20} />
            <span className="font-semibold">Вариант #{selectedVariant} выбран!</span>
          </div>
        )}
      </div>
    </div>
  );
}
