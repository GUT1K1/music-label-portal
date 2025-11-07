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
    .replace(/border-bottom: 2px solid hsl\(45, 100%, 60%\)/g, 'border-bottom: 2px solid #000');

  // Создаем временный контейнер для рендеринга
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '210mm';
  tempContainer.style.padding = '15mm';
  tempContainer.style.background = '#fff';
  tempContainer.style.color = '#000';
  tempContainer.innerHTML = pdfHtml;
  document.body.appendChild(tempContainer);

  // Даем время на загрузку изображений
  await new Promise(resolve => setTimeout(resolve, 500));

  // Создаем canvas из HTML
  const canvas = await html2canvas(tempContainer, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  // Удаляем временный контейнер
  document.body.removeChild(tempContainer);

  // Размеры A4 в мм
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  // Размеры с учетом полей
  const contentWidth = pdfWidth - 30; // 15mm с каждой стороны
  const contentHeight = pdfHeight - 30;

  // Создаем PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Вычисляем размеры для вставки canvas
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const totalPages = Math.ceil(imgHeight / contentHeight);

  // Разбиваем на страницы
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // Создаем отдельный canvas для каждой страницы
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = (canvas.width * contentHeight) / imgWidth;

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) continue;

    // Копируем нужную часть исходного canvas
    const sourceY = page * pageCanvas.height;
    const sourceHeight = Math.min(pageCanvas.height, canvas.height - sourceY);
    
    ctx.drawImage(
      canvas,
      0, sourceY,
      canvas.width, sourceHeight,
      0, 0,
      pageCanvas.width, sourceHeight
    );

    // Добавляем изображение в PDF
    const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(pageImgData, 'JPEG', 15, 15, imgWidth, contentHeight);
  }

  // Возвращаем PDF как Blob
  return pdf.output('blob');
}

export async function uploadContractPDF(pdfBlob: Blob): Promise<string> {
  const contractNumber = `420-${Date.now().toString().slice(-6)}`;
  const formData = new FormData();
  formData.append('file', pdfBlob, `Договор_${contractNumber}.pdf`);

  const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
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