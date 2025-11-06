import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      setExpiresAt(new Date(data.expires_at));
      setTimeLeft(data.expires_in_seconds);

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
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 md:gap-6 items-center">
            <div className="flex items-center gap-2 min-w-[120px]">
              <Icon name="Send" size={20} className="text-primary flex-shrink-0" />
              <span className="text-sm md:text-base font-medium whitespace-nowrap">Telegram</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" className="text-green-500 flex-shrink-0" size={16} />
                <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">Привязан</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${botActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                  {botActive ? 'Бот активен' : 'Бот недоступен'}
                </span>
              </div>
            </div>
            
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium bg-primary/5 rounded-lg hover:bg-primary/10 whitespace-nowrap"
            >
              <Icon name="ExternalLink" size={16} className="flex-shrink-0" />
              <span>Открыть Telegram</span>
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnlink}
              disabled={isUnlinking}
              className="h-9 w-9 p-0 hover:bg-red-500/10 hover:text-red-500 flex-shrink-0"
              title="Отвязать"
            >
              {isUnlinking ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="X" size={16} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Icon name="Send" size={20} className="text-primary md:size-6" />
          Telegram
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
        {!showCode ? (
          <>
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 space-y-2">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
                  <p>Telegram бот позволяет:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Получать быстрые уведомления о событиях</li>
                    <li>• Управлять сайтом через чат</li>
                    <li>• Отслеживать важные обновления</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowCode(true)}
              className="w-full h-10 md:h-12"
            >
              <Icon name="Link" size={16} className="mr-2" />
              Привязать аккаунт
            </Button>
          </>
        ) : code ? (
          <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs md:text-sm text-muted-foreground">Код для привязки:</span>
              {timeLeft > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <Icon name="Clock" size={12} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center text-xl md:text-2xl font-bold text-primary tabular-nums bg-background p-3 rounded-lg border border-primary/20">
                {code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="h-12 px-3"
              >
                <Icon name="Copy" size={16} className="text-primary" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowCode(false); setCode(null); }}
              className="w-full text-xs"
            >
              Отменить
            </Button>
          </div>
        ) : (
          <Button
            onClick={generateCode}
            disabled={isGenerating}
            className="w-full h-10 md:h-12"
          >
            {isGenerating ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <>
                <Icon name="Key" size={16} className="mr-2" />
                Получить код
              </>
            )}
          </Button>
        )}

        <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${botActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-xs md:text-sm text-muted-foreground">
              {botActive ? 'Бот активен' : 'Бот недоступен'}
            </span>
          </div>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Icon name="ExternalLink" size={14} />
            <span>Открыть</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}