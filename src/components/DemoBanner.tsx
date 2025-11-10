import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up w-full max-w-2xl px-4">
      <div className="bg-gradient-to-r from-gray-900/98 via-gray-900/95 to-gray-900/98 backdrop-blur-xl border-2 border-gold-400/30 rounded-2xl shadow-2xl shadow-gold-500/20 p-6">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold-500/20 to-orange-600/10 rounded-xl flex items-center justify-center">
            <Icon name="Eye" size={24} className="text-gold-400" />
          </div>

          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-bold text-white">
              Это демо-версия личного кабинета артиста
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Вы можете изучить интерфейс и возможности платформы. Чтобы получить полный доступ и начать загружать свою музыку — зарегистрируйтесь.
            </p>
            
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => window.location.href = '/app'}
                className="bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 hover:shadow-xl hover:shadow-gold-500/40 text-black font-bold transition-all duration-300 hover:scale-105"
              >
                <Icon name="Sparkles" size={16} className="mr-2" />
                Зарегистрироваться
              </Button>
              
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                className="border-gold-400/20 hover:border-gold-400/40 hover:bg-gold-400/5 text-gray-300"
              >
                Продолжить просмотр
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}