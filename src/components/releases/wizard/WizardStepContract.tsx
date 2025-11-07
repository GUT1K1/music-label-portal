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
  onSignatureComplete: (signatureDataUrl: string, contractPdfUrl: string) => void;
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

  const handleApproveContract = async () => {
    if (!signatureDataUrl) {
      alert('Сначала поставьте подпись');
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      // Генерируем и загружаем PDF договора
      const { generateContractPDF, uploadContractPDF } = await import('../contract/generateContractPDF');
      
      const pdfBlob = await generateContractPDF({
        requisites,
        releaseDate,
        tracks,
        coverUrl,
        signatureDataUrl
      });
      
      const pdfUrl = await uploadContractPDF(pdfBlob);
      
      onSignatureComplete(signatureDataUrl, pdfUrl);
    } catch (error) {
      console.error('Ошибка при создании договора:', error);
      alert('Не удалось создать договор. Попробуйте ещё раз.');
      setIsGeneratingPDF(false);
    }
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadContractAsPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      // A4 размеры: 210mm x 297mm = 794px x 1123px (96 DPI)
      const a4Width = 794;
      const a4Height = 1123;
      const padding = 60; // 15mm в пикселях
      const contentWidth = a4Width - (padding * 2);

      // Создаем временный контейнер
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = `${contentWidth}px`;
      tempContainer.style.padding = '0';
      tempContainer.style.background = '#fff';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.5';
      
      // Создаем обертку для контента с правильными стилями
      const wrapper = document.createElement('div');
      wrapper.style.maxWidth = `${contentWidth}px`;
      wrapper.style.wordWrap = 'break-word';
      wrapper.style.overflowWrap = 'break-word';
      wrapper.innerHTML = contractHtml;
      
      // Ограничиваем размер изображений
      const images = wrapper.querySelectorAll('img');
      images.forEach(img => {
        if (img.classList.contains('cover-image')) {
          (img as HTMLElement).style.maxWidth = '250px';
          (img as HTMLElement).style.maxHeight = '250px';
          (img as HTMLElement).style.display = 'block';
          (img as HTMLElement).style.margin = '15px auto';
        }
        if (img.classList.contains('signature-image')) {
          (img as HTMLElement).style.maxWidth = '150px';
          (img as HTMLElement).style.maxHeight = '40px';
        }
      });
      
      // Ограничиваем ширину таблиц
      const tables = wrapper.querySelectorAll('table');
      tables.forEach(table => {
        (table as HTMLElement).style.width = '100%';
        (table as HTMLElement).style.tableLayout = 'fixed';
        (table as HTMLElement).style.wordWrap = 'break-word';
      });
      
      tempContainer.appendChild(wrapper);
      document.body.appendChild(tempContainer);

      // Ждем загрузки изображений
      await new Promise(resolve => setTimeout(resolve, 800));

      // Создаем canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: contentWidth,
        windowWidth: contentWidth
      });

      document.body.removeChild(tempContainer);

      // Создаем PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Размеры контента в PDF (с учетом полей 15mm)
      const pdfContentWidth = 180; // 210 - 30
      const pdfContentHeight = 267; // 297 - 30
      
      // Вычисляем высоту изображения в PDF
      const imgHeight = (canvas.height * pdfContentWidth) / canvas.width;
      const totalPages = Math.ceil(imgHeight / pdfContentHeight);

      // Разбиваем на страницы
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const pageCanvas = document.createElement('canvas');
        const scale = canvas.width / pdfContentWidth;
        const pageHeightInPixels = pdfContentHeight * scale;
        
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightInPixels, canvas.height - (page * pageHeightInPixels));

        const ctx = pageCanvas.getContext('2d');
        if (!ctx) continue;

        const sourceY = page * pageHeightInPixels;
        const sourceHeight = Math.min(pageHeightInPixels, canvas.height - sourceY);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        ctx.drawImage(
          canvas,
          0, sourceY,
          canvas.width, sourceHeight,
          0, 0,
          pageCanvas.width, sourceHeight
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        const actualHeight = (sourceHeight * pdfContentWidth) / canvas.width;
        pdf.addImage(pageImgData, 'JPEG', 15, 15, pdfContentWidth, actualHeight);
      }

      const contractNumber = `420-${Date.now().toString().slice(-6)}`;
      pdf.save(`Договор_${contractNumber}.pdf`);

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
      <Card className="relative bg-card">
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
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <div 
            className="contract-preview bg-white rounded-lg p-6"
            style={{
              fontFamily: "'Times New Roman', serif",
              fontSize: '10pt',
              lineHeight: '1.5',
              color: '#000',
              backgroundColor: '#fff'
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
          disabled={!signatureDataUrl || isGeneratingPDF}
          className="gap-2"
          size="lg"
        >
          {isGeneratingPDF ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin" />
              Создание договора...
            </>
          ) : (
            <>
              <Icon name="Check" size={16} />
              Подтвердить и продолжить
            </>
          )}
        </Button>
      </div>
    </div>
  );
}