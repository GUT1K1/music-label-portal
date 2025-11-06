import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CountdownCardProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function CountdownCard({ countdown }: CountdownCardProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg border border-primary/30">
              <Icon name="Clock" className="text-primary" size={16} />
            </div>
            <h2 className="text-xs md:text-sm font-medium text-muted-foreground">До следующего отчета</h2>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.days}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground">д</span>
            </div>
            <span className="text-primary/30">•</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.hours}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground">ч</span>
            </div>
            <span className="text-primary/30 hidden md:inline">•</span>
            <div className="items-baseline gap-0.5 hidden md:flex">
              <span className="text-xl md:text-2xl font-bold text-primary tabular-nums">{countdown.minutes}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground">м</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
