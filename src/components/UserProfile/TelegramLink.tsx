import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface TelegramLinkProps {
  userId: number;
  telegramLinked: boolean;
  onUnlink?: () => void;
}

const TELEGRAM_BOT_URL = 'https://t.me/rf420smm_bot';

export function TelegramLink({ userId, telegramLinked, onUnlink }: TelegramLinkProps) {
  const { toast } = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [botActive, setBotActive] = useState(true);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
      
      if (diff <= 0) {
        setCode(null);
        setExpiresAt(null);
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Сбрасываем состояние при изменении статуса привязки
  useEffect(() => {
    if (telegramLinked) {
      setShowCode(false);
      setCode(null);
      setExpiresAt(null);
      setTimeLeft(0);
    }
  }, [telegramLinked]);

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_TELEGRAM_CODE, {
        method: 'GET',
        headers: {
          'X-User-Id': userId.toString()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ALREADY_LINKED') {
          toast({
            title: 'Telegram уже привязан',
            description: 'Ваш аккаунт уже привязан к Telegram боту',
            variant: 'default'
          });
        } else {
          throw new Error(data.error || 'Не удалось сгенерировать код');
        }
        return;
      }

      setCode(data.code);
      // Устанавливаем фиксированное время жизни кода - 3 минуты
      const expiryTime = new Date(Date.now() + 180000); // 180000 мс = 3 минуты
      setExpiresAt(expiryTime);
      setTimeLeft(180); // 180 секунд = 3 минуты

      toast({
        title: 'Код сгенерирован',
        description: 'Введите код в Telegram боте для привязки аккаунта'
      });
    } catch (error) {
      console.error('Failed to generate code:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать код',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast({
        title: 'Код скопирован',
        description: 'Код привязки скопирован в буфер обмена'
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUnlink = async () => {
    if (!confirm('Вы уверены, что хотите отвязать Telegram?')) return;
    
    setIsUnlinking(true);
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({ id: userId, telegram_chat_id: null })
      });

      if (!response.ok) throw new Error('Failed to unlink Telegram');

      toast({
        title: 'Успешно',
        description: 'Telegram отвязан от аккаунта'
      });

      if (onUnlink) onUnlink();
    } catch (error) {
      console.error('Failed to unlink Telegram:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отвязать Telegram',
        variant: 'destructive'
      });
    } finally {
      setIsUnlinking(false);
    }
  };

  if (telegramLinked) {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <Icon name="Send" size={18} className="text-primary flex-shrink-0" />
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Icon name="CheckCircle" className="text-green-500 flex-shrink-0" size={16} />
              <span className="text-sm text-muted-foreground whitespace-nowrap">Привязан</span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${botActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {botActive ? 'Активен' : 'Недоступен'}
              </span>
            </div>
            
            <div className="flex-1 min-w-0"></div>
            
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium bg-primary/5 rounded hover:bg-primary/10 whitespace-nowrap flex-shrink-0"
            >
              <Icon name="ArrowRight" size={14} className="flex-shrink-0" />
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnlink}
              disabled={isUnlinking}
              className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-500 flex-shrink-0"
              title="Отвязать"
            >
              {isUnlinking ? (
                <Icon name="Loader2" size={12} className="animate-spin" />
              ) : (
                <Icon name="X" size={12} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <Icon name="Send" size={18} className="text-primary flex-shrink-0" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help flex-shrink-0">
                  <Icon name="Info" size={16} className="text-primary/60 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Не привязан</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1 text-xs">
                  <p className="font-medium">Telegram бот позволяет:</p>
                  <ul className="space-y-0.5 ml-3">
                    <li>• Получать быстрые уведомления</li>
                    <li>• Управлять сайтом через чат</li>
                    <li>• Отслеживать обновления</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${botActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {botActive ? 'Активен' : 'Недоступен'}
              </span>
            </div>
            
            <div className="flex-1 min-w-0"></div>
            
            {!showCode ? (
              <Button
                onClick={() => setShowCode(true)}
                size="sm"
                className="flex-shrink-0 h-8 text-xs px-2"
              >
                <Icon name="Link" size={12} className="mr-1" />
                <span className="hidden lg:inline">Привязать</span>
              </Button>
            ) : code ? (
              <>
                <code className="text-sm font-bold text-primary tabular-nums bg-primary/5 px-2 py-1 rounded border border-primary/20 flex-shrink-0">
                  {code}
                </code>
                {timeLeft > 0 && (
                  <span className="text-xs text-amber-500 tabular-nums whitespace-nowrap flex-shrink-0">
                    {formatTime(timeLeft)}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="h-7 w-7 p-0 flex-shrink-0"
                  title="Скопировать"
                >
                  <Icon name="Copy" size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowCode(false); setCode(null); }}
                  className="h-7 w-7 p-0 flex-shrink-0"
                  title="Отменить"
                >
                  <Icon name="X" size={12} />
                </Button>
              </>
            ) : (
              <Button
                onClick={generateCode}
                disabled={isGenerating}
                size="sm"
                className="flex-shrink-0 h-8 text-xs px-2"
              >
                {isGenerating ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="Key" size={12} className="mr-1" />
                    <span className="hidden lg:inline">Код</span>
                  </>
                )}
              </Button>
            )}

            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium bg-primary/5 rounded hover:bg-primary/10 whitespace-nowrap flex-shrink-0"
            >
              <Icon name="ArrowRight" size={14} className="flex-shrink-0" />
            </a>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}