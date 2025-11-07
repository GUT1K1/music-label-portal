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

      // Генерируем PDF-версию договора с белым фоном
      const pdfContractHtml = generateContract({
        requisites,
        releaseDate,
        tracks,
        coverUrl,
        signatureDataUrl: signatureDataUrl || undefined
      });

      // Создаем временный контейнер для PDF (с белым фоном)
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.background = '#fff';
      tempContainer.style.fontFamily = 'Times New Roman, serif';
      tempContainer.style.color = '#000';
      
      // Заменяем тёмные стили на светлые для PDF
      const pdfHtml = pdfContractHtml
        .replace(/color: hsl\(45, 95%, 90%\)/g, 'color: #000')
        .replace(/color: hsl\(45, 100%, 60%\)/g, 'color: #000')
        .replace(/color: hsl\(45, 100%, 70%\)/g, 'color: #222')
        .replace(/color: hsl\(45, 30%, 50%\)/g, 'color: #666')
        .replace(/background: transparent/g, 'background: #fff')
        .replace(/background: hsl\(0, 0%, 8%\)/g, 'background: #fafafa')
        .replace(/background: hsl\(0, 0%, 5%\)/g, 'background: #fff')
        .replace(/background: linear-gradient\(to right, hsl\(45, 30%, 20%\) 0%, transparent 100%\)/g, 'background: linear-gradient(to right, #f8f8f8 0%, #fff 100%)')
        .replace(/background: hsl\(45, 30%, 15%\)/g, 'background: #f5f5f5')
        .replace(/border: 1px solid hsl\(45, 30%, 20%\)/g, 'border: 1px solid #ddd')
        .replace(/border-bottom: 3px double hsl\(45, 100%, 60%\)/g, 'border-bottom: 3px double #000')
        .replace(/border-left: 4px solid hsl\(45, 100%, 60%\)/g, 'border-left: 4px solid #333')
        .replace(/border-bottom: 1px solid hsl\(45, 100%, 60%\)/g, 'border-bottom: 1px solid #000')
        .replace(/border-bottom: 2px solid hsl\(45, 100%, 60%\)/g, 'border-bottom: 2px solid #000')
        .replace(/filter: brightness\(0\) saturate\(100%\) invert\(83%\) sepia\(49%\) saturate\(1053%\) hue-rotate\(0deg\) brightness\(102%\) contrast\(101%\);/g, 'filter: none;');
      
      tempContainer.innerHTML = pdfHtml;
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

      // Получаем body из шаблона
      let bodyContent = tempContainer.querySelector('body');
      if (!bodyContent) {
        bodyContent = tempContainer;
      }

      // Функция рендера секции
      const renderSection = async (content: string, isFirst: boolean) => {
        const sectionContainer = document.createElement('div');
        sectionContainer.style.position = 'absolute';
        sectionContainer.style.left = '-9999px';
        sectionContainer.style.width = '794px';
        sectionContainer.style.padding = '60px';
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
          windowWidth: 794
        });
        
        document.body.removeChild(sectionContainer);
        
        if (!isFirst) {
          pdf.addPage();
        }
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = 297;
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (imgHeight <= pageHeight) {
          // Контент помещается на одну страницу
          pdf.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          // Контент занимает несколько страниц - разбиваем
          let position = 0;
          let heightLeft = imgHeight;

          // Первая часть на текущей странице
          pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Продолжение на следующих страницах
          while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      };

      // Получаем все основные разделы
      const contractHeader = bodyContent.querySelector('.contract-header');
      const articlesSection = bodyContent.querySelector('.articles-section');
      const article8Section = bodyContent.querySelector('.article-8');
      const appendixes = bodyContent.querySelectorAll('.appendix');
      
      // Страница 1: Шапка договора с терминами и подписями
      if (contractHeader) {
        await renderSection((contractHeader as HTMLElement).outerHTML, true);
      }
      
      // Страница 2: Статьи 1-6
      if (articlesSection) {
        await renderSection((articlesSection as HTMLElement).outerHTML, false);
      }
      
      // Страница 3: Статья 7 (реквизиты и подписи)
      if (article8Section) {
        await renderSection((article8Section as HTMLElement).outerHTML, false);
      }
      
      // Остальные страницы: Приложения
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
    <div className="p-6 pt-0 space-y-6">
      {/* Заголовок шага */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Договор о дистрибуции
        </h2>
        <p className="text-sm text-muted-foreground">
          Ознакомьтесь с условиями договора и поставьте электронную подпись
        </p>
      </div>

      {/* Предпросмотр договора в стильной карточке */}
      <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="relative">
          {/* Кнопка скачивания */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={downloadContractAsPDF}
              disabled={isGeneratingPDF}
              variant="outline"
              size="sm"
              className="gap-2 bg-card/90 hover:bg-card backdrop-blur-sm border-primary/30"
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

          {/* Контейнер с договором */}
          <div className="h-[500px] overflow-y-auto bg-background/50 border border-border/30 rounded-lg m-4">
            <div 
              className="contract-preview p-6"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          </div>
        </div>
      </Card>

      {/* Блоки подписи и действий */}
      <div className="space-y-4">
        {/* Блок подписи */}
        {!signatureDataUrl ? (
          <Card className="p-6 bg-primary/5 border-2 border-primary/20 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="PenTool" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Электронная подпись</h3>
                  <p className="text-sm text-muted-foreground">
                    Нарисуйте вашу подпись для подтверждения договора
                  </p>
                </div>
              </div>

              {!showSignaturePad ? (
                <Button 
                  onClick={() => setShowSignaturePad(true)}
                  className="w-full bg-primary hover:bg-primary/90"
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
          <Card className="p-6 bg-primary/10 border-2 border-primary/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
                  <Icon name="Check" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Подпись поставлена</h3>
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
                className="gap-2 border-primary/30"
              >
                <Icon name="Edit" size={14} />
                Изменить
              </Button>
            </div>
            
            <div className="p-4 bg-card/50 rounded-lg border border-primary/20">
              <p className="text-sm font-medium mb-3 text-primary">Предпросмотр подписи:</p>
              <div className="flex items-center justify-center bg-card rounded-lg p-4 border-b-2 border-primary/30">
                <img 
                  src={signatureDataUrl} 
                  alt="Подпись" 
                  className="max-h-20 max-w-full object-contain"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Информационный блок */}
        <Card className="p-4 bg-secondary/10 border-2 border-secondary/20 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="AlertTriangle" size={20} className="text-secondary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-secondary">Важная информация</p>
              <p className="text-xs text-muted-foreground">
                Поставив электронную подпись, вы подтверждаете, что ознакомились с условиями договора 
                и согласны с ними. Электронная подпись имеет юридическую силу.
              </p>
            </div>
          </div>
        </Card>

        {/* Кнопки навигации */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 border-border/50"
          >
            <Icon name="ChevronLeft" size={16} />
            Назад
          </Button>
          
          <div className="flex-1" />

          <Button
            onClick={handleApproveContract}
            disabled={!signatureDataUrl || isGeneratingPDF}
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            size="lg"
          >
            {isGeneratingPDF ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" />
                Создание договора...
              </>
            ) : (
              <>
                <Icon name="Check" size={18} />
                Подтвердить и отправить
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}