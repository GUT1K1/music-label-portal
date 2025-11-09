import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import WithdrawalDialog from '@/components/WithdrawalDialog';
import { API_ENDPOINTS } from '@/config/api';

interface ArtistFinanceProps {
  userId: number;
  userBalance: number;
  onRefreshData?: () => void;
}

interface FinancialReport {
  id: number;
  period: string;
  artist_name: string;
  album_name: string;
  amount: number;
  release_id: number | null;
  uploaded_at: string;
  status: string;
}

interface ReportStats {
  total_earned: number;
  reports_count: number;
  by_period: Array<{ period: string; total: number }>;
}

export default function ArtistFinance({ userId, userBalance, onRefreshData }: ArtistFinanceProps) {
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  const minWithdrawal = 1500;
  const balance = userBalance || 0;
  const canWithdraw = balance >= minWithdrawal;

  useEffect(() => {
    loadReports();
  }, [userId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ARTIST_FINANCIAL_REPORTS, {
        headers: { 'X-User-Id': userId.toString() }
      });
      
      if (!response.ok) throw new Error('Failed to load reports');
      
      const data = await response.json();
      setReports(data.reports || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error loading financial reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Текущий баланс</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {balance.toLocaleString()} ₽
                </div>
                <div className="text-xs text-gray-400">
                  {canWithdraw ? `Доступно для вывода: ${balance.toLocaleString()} ₽` : `До минимального вывода: ${(minWithdrawal - balance).toLocaleString()} ₽`}
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

            {loading ? (
              <div className="flex justify-center py-8">
                <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : stats ? (
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
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.total_earned.toLocaleString()} ₽
                  </div>
                  <div className="text-xs text-gray-400">Всего заработано</div>
                </div>
              </div>
            ) : (
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
            )}
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

          {stats && stats.by_period.length > 0 && (
            <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Calendar" className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-white">По периодам</h3>
              </div>

              <div className="space-y-2">
                {stats.by_period.map((item) => (
                  <div key={item.period} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-gray-400">{item.period}</span>
                    <span className="text-sm font-semibold text-white">{item.total.toLocaleString()} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="FileText" className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Детализация по релизам</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Период</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Релиз</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-300">{report.period}</td>
                    <td className="py-3 px-4 text-sm text-white">{report.album_name}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-400 text-right">
                      +{report.amount.toLocaleString()} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="FileBarChart" className="w-16 h-16 text-gray-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-white mb-2">Отчёты пока недоступны</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              После первых начислений здесь появятся детальные отчёты о доходах от стриминговых платформ
            </p>
          </div>
        )}
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