import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import SignaturePad from './SignaturePad';
import { generateContract } from '../contract/generateContract';
import { ContractRequisites, Track } from '../types';

interface WizardStepContractProps {
  requisites: ContractRequisites;
  releaseDate: string;
  tracks: Track[];
  coverUrl: string;
  onSignatureComplete: (signatureDataUrl: string) => void;
  onBack: () => void;
}

export default function WizardStepContract({
  requisites,
  releaseDate,
  tracks,
  coverUrl,
  onSignatureComplete,
  onBack
}: WizardStepContractProps) {
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [contractHtml, setContractHtml] = useState<string>('');

  useEffect(() => {
    // Генерация договора при загрузке компонента
    const html = generateContract({
      requisites,
      releaseDate,
      tracks,
      coverUrl,
      signatureDataUrl: signatureDataUrl || undefined
    });
    setContractHtml(html);
  }, [requisites, releaseDate, tracks, coverUrl, signatureDataUrl]);

  const handleSaveSignature = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    setShowSignaturePad(false);
  };

  const handleApproveContract = () => {
    if (!signatureDataUrl) {
      alert('Сначала поставьте подпись');
      return;
    }
    onSignatureComplete(signatureDataUrl);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Лицензионный договор</h2>
        <p className="text-sm text-muted-foreground">
          Ознакомьтесь с договором и поставьте электронную подпись
        </p>
      </div>

      {/* Предпросмотр договора */}
      <Card className="p-4 max-h-[500px] overflow-y-auto">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: contractHtml }}
        />
      </Card>

      {/* Блок подписи */}
      {!signatureDataUrl ? (
        <Card className="p-6 bg-blue-500/5 border-2 border-blue-500/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="PenTool" size={24} className="text-blue-500" />
              <div>
                <h3 className="font-semibold">Электронная подпись</h3>
                <p className="text-sm text-muted-foreground">
                  Нарисуйте вашу подпись для подтверждения договора
                </p>
              </div>
            </div>

            {!showSignaturePad ? (
              <Button 
                onClick={() => setShowSignaturePad(true)}
                className="w-full"
                size="lg"
              >
                <Icon name="PenTool" size={18} className="mr-2" />
                Поставить подпись
              </Button>
            ) : (
              <SignaturePad onSave={handleSaveSignature} />
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-green-500/5 border-2 border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="Check" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Подпись поставлена</h3>
                <p className="text-sm text-muted-foreground">
                  Договор готов к отправке на модерацию
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setSignatureDataUrl(null)}
                variant="outline"
                size="sm"
              >
                Изменить
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-xs text-muted-foreground mb-2">Ваша подпись:</p>
            <img 
              src={signatureDataUrl} 
              alt="Подпись" 
              className="max-h-20 border-b"
            />
          </div>
        </Card>
      )}

      {/* Информационный блок */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="AlertTriangle" size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Важно!</p>
            <p className="text-xs text-muted-foreground">
              Поставив электронную подпись, вы подтверждаете, что ознакомились с условиями договора 
              и согласны с ними. Электронная подпись имеет юридическую силу.
            </p>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <Icon name="ChevronLeft" size={16} />
          Назад к проверке
        </Button>
        
        <div className="flex-1" />

        <Button
          onClick={handleApproveContract}
          disabled={!signatureDataUrl}
          className="gap-2"
          size="lg"
        >
          <Icon name="Check" size={16} />
          Подтвердить и продолжить
        </Button>
      </div>
    </div>
  );
}