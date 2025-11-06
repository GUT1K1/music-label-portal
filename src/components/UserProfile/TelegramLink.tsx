import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

interface TelegramLinkProps {
  userId: number;
  telegramLinked: boolean;
  onUnlink?: () => void;
}

export function TelegramLink({ userId, telegramLinked, onUnlink }: TelegramLinkProps) {
  const { toast } = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [showCode, setShowCode] = useState(false);

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

  const handleUnlink = async () => {
    if (!confirm('Вы уверены, что хотите отвязать Telegram?')) return;
    
    setIsUnlinking(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({ telegram_chat_id: null })
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
      <Card className="bg-gradient-to-r from-blue-500/5 via-sky-500/5 to-blue-500/5 border-blue-500/20 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Icon name="Send" className="text-blue-500" size={16} />
              </div>
              <h2 className="text-xs md:text-sm font-medium text-muted-foreground">Telegram</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Icon name="CheckCircle" className="text-blue-500" size={16} />
                <span className="text-xs md:text-sm font-medium text-blue-500">Привязан</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnlink}
                disabled={isUnlinking}
                className="h-6 px-2 text-xs hover:bg-red-500/10 hover:text-red-500"
              >
                {isUnlinking ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <Icon name="X" size={12} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/5 via-sky-500/5 to-blue-500/5 border-blue-500/20 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Icon name="Send" className="text-blue-500" size={16} />
            </div>
            <h2 className="text-xs md:text-sm font-medium text-muted-foreground">Telegram</h2>
          </div>
          
          {!showCode ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode(true)}
              className="h-6 px-2 md:px-3 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
            >
              <Icon name="Link" size={12} className="mr-1" />
              <span className="hidden md:inline">Привязать</span>
            </Button>
          ) : code ? (
            <div className="flex items-center gap-2">
              <code className="text-sm md:text-base font-bold text-blue-500 tabular-nums">
                {code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-6 w-6 p-0 hover:bg-blue-500/20"
              >
                <Icon name="Copy" size={12} className="text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setShowCode(false); setCode(null); }}
                className="h-6 w-6 p-0 hover:bg-red-500/20"
              >
                <Icon name="X" size={12} className="text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={generateCode}
              disabled={isGenerating}
              className="h-6 px-2 md:px-3 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
            >
              {isGenerating ? (
                <Icon name="Loader2" size={12} className="animate-spin" />
              ) : (
                <>
                  <Icon name="Key" size={12} className="mr-1" />
                  <span className="hidden md:inline">Код</span>
                </>
              )}
            </Button>
          )}
        </div>
        
        {showCode && code && timeLeft > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-500">
            <Icon name="Clock" size={10} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}