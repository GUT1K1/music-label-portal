import { ContractRequisites, Track } from '../types';
import { generateContract } from './generateContract';
import { API_ENDPOINTS } from '@/config/api';

interface GeneratePDFOptions {
  requisites: ContractRequisites;
  releaseDate: string;
  tracks: Track[];
  coverUrl: string;
  signatureDataUrl: string;
}

export async function generateContractPDF(options: GeneratePDFOptions): Promise<Blob> {
  const { requisites, releaseDate, tracks, coverUrl, signatureDataUrl } = options;

  // Динамическая загрузка библиотек
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ]);

  // Генерируем HTML договора
  const contractHtml = generateContract({
    requisites,
    releaseDate,
    tracks,
    coverUrl,
    signatureDataUrl
  });

  // Заменяем тёмные стили на светлые для PDF
  const pdfHtml = contractHtml
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

  // Создаем временный контейнер для парсинга HTML
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.innerHTML = pdfHtml;
  document.body.appendChild(tempContainer);

  // Ждем загрузки изображений
  await new Promise(resolve => setTimeout(resolve, 500));

  // Создаем PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Получаем body из шаблона
  let bodyContent = tempContainer.querySelector('body');
  if (!bodyContent) {
    bodyContent = tempContainer;
  }

  // Функция рендера секции (та же логика что в WizardStepContract)
  const renderSection = async (content: string, isFirst: boolean) => {
    const sectionContainer = document.createElement('div');
    sectionContainer.style.position = 'absolute';
    sectionContainer.style.left = '-9999px';
    sectionContainer.style.width = '700px';
    sectionContainer.style.padding = '50px';
    sectionContainer.style.background = '#fff';
    sectionContainer.style.fontFamily = 'Times New Roman, serif';
    sectionContainer.style.fontSize = '10pt';
    sectionContainer.style.lineHeight = '1.35';
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
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 700,
      windowWidth: 700
    });
    
    document.body.removeChild(sectionContainer);
    
    if (!isFirst) {
      pdf.addPage();
    }
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297;
    const imageData = canvas.toDataURL('image/jpeg', 0.6);
    
    if (imgHeight <= pageHeight) {
      pdf.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      let position = 0;
      let heightLeft = imgHeight;
      
      pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }
  };

  // Рендерим все секции по очереди
  const contractHeader = bodyContent.querySelector('.contract-header');
  const articlesSection = bodyContent.querySelector('.articles-section');
  const article8Section = bodyContent.querySelector('.article-8');
  const appendixes = bodyContent.querySelectorAll('.appendix');
  
  if (contractHeader) {
    await renderSection((contractHeader as HTMLElement).outerHTML, true);
  }
  
  if (articlesSection) {
    await renderSection((articlesSection as HTMLElement).outerHTML, false);
  }
  
  if (article8Section) {
    await renderSection((article8Section as HTMLElement).outerHTML, false);
  }
  
  for (const appendix of Array.from(appendixes)) {
    await renderSection((appendix as HTMLElement).outerHTML, false);
  }

  document.body.removeChild(tempContainer);

  // Возвращаем PDF как Blob
  return pdf.output('blob');
}

export async function uploadContractPDF(pdfBlob: Blob): Promise<string> {
  const contractNumber = `420-${Date.now().toString().slice(-6)}`;
  const formData = new FormData();
  formData.append('file', pdfBlob, `Договор_${contractNumber}.pdf`);

  const response = await fetch(API_ENDPOINTS.UPLOAD_DIRECT, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить договор на сервер');
  }

  const data = await response.json();
  return data.url;
}