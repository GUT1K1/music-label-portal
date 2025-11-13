import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 animate-slide-up flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-2xl bg-gray-900 sm:bg-gradient-to-r sm:from-gray-900/98 sm:via-gray-900/95 sm:to-gray-900/98 backdrop-blur-xl border-2 border-gold-400/50 rounded-xl sm:rounded-2xl shadow-2xl shadow-gold-500/20 p-4 sm:p-6">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-white transition-colors"
        >
          <Icon name="X" size={18} />
        </button>

        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-500/20 to-orange-600/10 rounded-xl flex items-center justify-center">
            <Icon name="Eye" size={20} className="text-gold-400 sm:w-6 sm:h-6" />
          </div>

          <div className="flex-1 space-y-2 sm:space-y-3 pr-6">
            <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">
              Это демо-версия личного кабинета
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Изучите интерфейс и возможности. Для полного доступа — зарегистрируйтесь.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
              <Button
                onClick={() => window.location.href = '/app'}
                className="bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 hover:shadow-xl hover:shadow-gold-500/40 text-black font-bold transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                size="sm"
              >
                <Icon name="Sparkles" size={14} className="mr-1.5" />
                Зарегистрироваться
              </Button>
              
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                className="border-gold-400/20 hover:border-gold-400/40 hover:bg-gold-400/5 text-gray-300 text-sm sm:text-base w-full sm:w-auto"
                size="sm"
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