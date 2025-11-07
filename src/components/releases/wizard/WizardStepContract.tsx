import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import SignaturePad from './SignaturePad';
import { generateContract } from '../contract/generateContract';
import { ContractRequisites, Track } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadContractAsPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Создаём временный контейнер для рендеринга
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contractHtml;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.padding = '20px';
      tempDiv.style.background = '#fff';
      document.body.appendChild(tempDiv);

      // Генерируем canvas из HTML
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Удаляем временный контейнер
      document.body.removeChild(tempDiv);

      // Создаём PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Добавляем первую страницу
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Добавляем остальные страницы если контент не влезает
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Скачиваем PDF
      pdf.save('Договор_420smm.pdf');
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      alert('Не удалось создать PDF. Попробуйте ещё раз.');
    } finally {
      setIsGeneratingPDF(false);
    }
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
      <Card className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={downloadContractAsPDF}
            disabled={isGeneratingPDF}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <Icon name="Loader2" size={14} className="animate-spin" />
                Создание PDF...
              </>
            ) : (
              <>
                <Icon name="Download" size={14} />
                Скачать PDF
              </>
            )}
          </Button>
        </div>
        <div className="p-6 max-h-[600px] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
          <div 
            className="contract-preview"
            style={{
              fontFamily: "'Times New Roman', serif",
              fontSize: '10pt',
              lineHeight: '1.5',
              color: '#000'
            }}
            dangerouslySetInnerHTML={{ __html: contractHtml }}
          />
        </div>
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
            <Button 
              onClick={() => {
                setSignatureDataUrl(null);
                setShowSignaturePad(true);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Icon name="Edit" size={14} />
              Изменить
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-200">
            <p className="text-sm font-medium mb-3">Предпросмотр подписи:</p>
            <div className="flex items-center justify-center bg-gray-50 rounded p-4 border-b-2 border-gray-300">
              <img 
                src={signatureDataUrl} 
                alt="Подпись" 
                className="max-h-16 max-w-full object-contain"
              />
            </div>
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