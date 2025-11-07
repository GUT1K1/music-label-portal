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
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Создаем временный контейнер
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.background = '#fff';
      tempContainer.style.fontFamily = 'Times New Roman, serif';
      tempContainer.style.color = '#000';
      tempContainer.innerHTML = contractHtml;
      document.body.appendChild(tempContainer);

      // Ждем загрузки изображений
      await new Promise(resolve => setTimeout(resolve, 500));
      const imgElements = tempContainer.querySelectorAll('img');
      await Promise.all(
        Array.from(imgElements).map(img => {
          if ((img as HTMLImageElement).complete) return Promise.resolve();
          return new Promise(resolve => {
            (img as HTMLImageElement).onload = () => resolve(null);
            (img as HTMLImageElement).onerror = () => resolve(null);
          });
        })
      );

      // Получаем body из шаблона (может быть как <body>, так и прямо содержимое в div)
      let bodyContent = tempContainer.querySelector('body');
      if (!bodyContent) {
        // Если body не найден, значит браузер распарсил HTML и содержимое лежит прямо в tempContainer
        bodyContent = tempContainer;
      }

      // Функция рендера секции
      const renderSection = async (content: string, isFirst: boolean) => {
        const sectionContainer = document.createElement('div');
        sectionContainer.style.position = 'absolute';
        sectionContainer.style.left = '-9999px';
        sectionContainer.style.width = '794px'; // 210mm
        sectionContainer.style.padding = '60px'; // 15mm margins
        sectionContainer.style.background = '#fff';
        sectionContainer.style.fontFamily = 'Times New Roman, serif';
        sectionContainer.style.fontSize = '11pt';
        sectionContainer.style.lineHeight = '1.4';
        sectionContainer.style.color = '#000';
        sectionContainer.style.boxSizing = 'border-box';
        sectionContainer.innerHTML = content;
        
        document.body.appendChild(sectionContainer);
        
        // Ждем загрузки изображений в секции
        const sectionImages = sectionContainer.querySelectorAll('img');
        await Promise.all(
          Array.from(sectionImages).map(img => {
            if ((img as HTMLImageElement).complete) return Promise.resolve();
            return new Promise(resolve => {
              (img as HTMLImageElement).onload = () => resolve(null);
              (img as HTMLImageElement).onerror = () => resolve(null);
            });
          })
        );
        
        const canvas = await html2canvas(sectionContainer, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          windowWidth: 794,
          onclone: (clonedDoc) => {
            const clonedContainer = clonedDoc.querySelector('div');
            if (clonedContainer) {
              (clonedContainer as HTMLElement).style.width = '794px';
            }
          }
        });
        
        document.body.removeChild(sectionContainer);
        
        if (!isFirst) {
          pdf.addPage();
        }
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = 297;
        
        if (imgHeight <= pageHeight) {
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          let heightLeft = imgHeight;
          let position = 0;
          let page = 0;
          
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft > 0) {
            page++;
            position = -pageHeight * page;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      };

      // Получаем все основные разделы
      const contractHeader = bodyContent.querySelector('.contract-header');
      const articlesSection = bodyContent.querySelector('.articles-section');
      const article8Section = bodyContent.querySelector('.article-8');
      const appendixes = bodyContent.querySelectorAll('.appendix');
      
      // Страница 1: Шапка договора (заголовок и преамбула)
      if (contractHeader) {
        await renderSection((contractHeader as HTMLElement).outerHTML, true);
      }
      
      // Страница 2-N: Статьи 1-7 (термины и определения + все статьи до 8-й)
      if (articlesSection) {
        await renderSection((articlesSection as HTMLElement).outerHTML, false);
      }
      
      // Страница N+1: Статья 8 (реквизиты и подписи)
      if (article8Section) {
        await renderSection((article8Section as HTMLElement).outerHTML, false);
      }
      
      // Страницы N+2 и далее: Приложения (каждое на отдельной странице)
      for (const appendix of Array.from(appendixes)) {
        await renderSection((appendix as HTMLElement).outerHTML, false);
      }

      document.body.removeChild(tempContainer);

      const contractNumber = `420-${Date.now().toString().slice(-6)}`;
      pdf.save(`Договор_${contractNumber}.pdf`);
      setIsGeneratingPDF(false);

    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      alert('Не удалось создать PDF. Попробуйте ещё раз.');
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 bg-transparent">
        <h2 className="text-2xl font-bold text-primary">Лицензионный договор</h2>
        <p className="text-sm text-muted-foreground">
          Ознакомьтесь с договором и поставьте электронную подпись
        </p>
      </div>

      {/* Предпросмотр договора */}
      <div className="relative border rounded-lg bg-card">
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
      </div>

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
          
          <div className="mt-4 p-4 bg-card/50 rounded-lg border-2 border-border">
            <p className="text-sm font-medium mb-3">Предпросмотр подписи:</p>
            <div className="flex items-center justify-center bg-background rounded p-4 border-b-2 border-primary/30">
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