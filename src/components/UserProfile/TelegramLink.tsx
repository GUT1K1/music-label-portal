import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface TelegramLinkProps {
  userId: number;
  telegramLinked: boolean;
}

export function TelegramLink({ userId, telegramLinked }: TelegramLinkProps) {
  const { toast } = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

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

  if (telegramLinked) {
    return (
      <Card className="bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Send" size={20} className="text-blue-500" />
            Telegram бот
          </CardTitle>
          <CardDescription>
            Управление привязкой Telegram бота
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <div>
              <p className="font-medium text-green-500">Telegram привязан</p>
              <p className="text-sm text-muted-foreground">Вы можете получать уведомления в боте</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Send" size={20} className="text-blue-500" />
          Привязать Telegram бот
        </CardTitle>
        <CardDescription>
          Получайте уведомления и управляйте задачами через Telegram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!code ? (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Для привязки Telegram бота:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Нажмите кнопку "Сгенерировать код"</li>
                <li>Откройте бота в Telegram</li>
                <li>Отправьте боту полученный код</li>
              </ol>
            </div>
            <Button
              onClick={generateCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Key" size={16} className="mr-2" />
                  Сгенерировать код
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Ваш код привязки:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-4xl font-bold text-blue-500 tracking-wider">
                    {code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyCode}
                    className="hover:bg-blue-500/20"
                  >
                    <Icon name="Copy" size={20} className="text-blue-500" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm">
                <Icon name="Clock" size={16} className="text-amber-500" />
                <span className="text-amber-500 font-medium">
                  Действителен: {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Что делать дальше:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Найдите бота в Telegram (@your_bot_username)</li>
                <li>Нажмите /start или отправьте любое сообщение</li>
                <li>Отправьте боту код: <code className="px-1.5 py-0.5 rounded bg-muted">{code}</code></li>
              </ol>
            </div>

            <Button
              onClick={generateCode}
              variant="outline"
              className="w-full"
              disabled={isGenerating}
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Сгенерировать новый код
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
