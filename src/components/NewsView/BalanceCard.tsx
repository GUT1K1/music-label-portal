import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg border border-primary/30">
              <Icon name="DollarSign" className="text-primary" size={16} />
            </div>
            <h2 className="text-xs md:text-sm font-medium text-muted-foreground">Баланс</h2>
          </div>
          
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">
              {balance.toLocaleString('ru-RU')}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">₽</span>
          </div>
        </div>
      </div>
    </Card>
  );
}