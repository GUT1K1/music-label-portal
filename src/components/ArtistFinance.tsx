import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import WithdrawalDialog from '@/components/WithdrawalDialog';

interface ArtistFinanceProps {
  userId: number;
  userBalance: number;
  onRefreshData?: () => void;
}

export default function ArtistFinance({ userId, userBalance, onRefreshData }: ArtistFinanceProps) {
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const minWithdrawal = 1500;
  const canWithdraw = userBalance >= minWithdrawal;

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Текущий баланс</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {userBalance.toLocaleString()} ₽
                </div>
                <div className="text-xs text-gray-400">
                  {canWithdraw ? `Доступно для вывода: ${userBalance.toLocaleString()} ₽` : `До минимального вывода: ${(minWithdrawal - userBalance).toLocaleString()} ₽`}
                </div>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Icon name="Wallet" className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                onClick={() => setShowTopUp(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
              >
                <Icon name="Plus" className="w-4 h-4 mr-2" />
                Пополнить
              </Button>
              <Button
                onClick={() => setShowWithdrawal(true)}
                disabled={!canWithdraw}
                className="bg-white/10 hover:bg-white/20 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ArrowDownToLine" className="w-4 h-4 mr-2" />
                Вывести
              </Button>
            </div>

            {!canWithdraw && (
              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-2">
                <Icon name="Info" className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-300">
                  Минимальная сумма для вывода — {minWithdrawal.toLocaleString()} ₽
                </p>
              </div>
            )}
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="TrendingUp" className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-white">Статистика доходов</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">0 ₽</div>
                <div className="text-xs text-gray-400">Сегодня</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">0 ₽</div>
                <div className="text-xs text-gray-400">Этот месяц</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">0 ₽</div>
                <div className="text-xs text-gray-400">Всего</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Info" className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-white">Информация</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Icon name="Check" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Минимальный вывод</div>
                  <div className="text-gray-400 text-xs">От 1 500 ₽</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icon name="Check" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Срок вывода</div>
                  <div className="text-gray-400 text-xs">1-3 рабочих дня</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icon name="Check" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Способы вывода</div>
                  <div className="text-gray-400 text-xs">Банковская карта</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icon name="Check" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Комиссия</div>
                  <div className="text-gray-400 text-xs">Без комиссии</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Clock" className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-white">История</h3>
            </div>

            <div className="text-center py-8">
              <Icon name="FileText" className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Нет транзакций</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="FileText" className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Финансовые отчёты</h3>
        </div>

        <div className="text-center py-12">
          <Icon name="FileBarChart" className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-white mb-2">Отчёты пока недоступны</h4>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            После первых начислений здесь появятся детальные отчёты о доходах от стриминговых платформ
          </p>
        </div>
      </div>

      <WithdrawalDialog
        open={showWithdrawal}
        onOpenChange={setShowWithdrawal}
        userId={userId}
        currentBalance={userBalance}
        onSuccess={onRefreshData}
      />

      {showTopUp && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTopUp(false)}
        >
          <div
            className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Пополнение баланса</h3>
              <button
                onClick={() => setShowTopUp(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-8">
              <Icon name="Wallet" className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">Скоро будет доступно</h4>
              <p className="text-sm text-gray-400">
                Функция пополнения баланса находится в разработке
              </p>
            </div>

            <Button
              onClick={() => setShowTopUp(false)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Понятно
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
