import { CONTRACT_TEMPLATE } from './contractTemplate';
import { ContractRequisites } from '../types';
import { Track } from '../types';

interface ContractData {
  requisites: ContractRequisites;
  releaseDate: string;
  tracks: Track[];
  coverUrl: string;
  signatureDataUrl?: string;
}

export function generateContract(data: ContractData): string {
  const {  requisites, releaseDate, tracks, coverUrl, signatureDataUrl } = data;
  
  console.log('🔍 generateContract called with:', {
    has_requisites: !!requisites,
    releaseDate,
    tracks_count: tracks.length,
    has_coverUrl: !!coverUrl,
    signatureDataUrl_length: signatureDataUrl?.length,
    signatureDataUrl_preview: signatureDataUrl?.substring(0, 50)
  });
  
  // Номер договора (уникальный)
  const contractNumber = `420-${Date.now().toString().slice(-6)}`;
  
  // Дата заключения (через 14 дней)
  const contractDate = new Date();
  contractDate.setDate(contractDate.getDate() + 14);
  const formattedDate = contractDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Краткое ФИО (Иванов И.И.)
  const shortName = requisites.full_name
    .split(' ')
    .map((n, i) => (i === 0 ? n : n.charAt(0) + '.'))
    .join(' ');
  
  // Процент роялти
  const royaltyPercent = '90%';
  
  // Генерация таблицы треков для Приложения 1
  const tracksTableRows = tracks.map(track => `
    <tr>
      <td>${track.title}</td>
      <td>${track.author_lyrics}</td>
      <td>${track.composer}</td>
      <td>${track.author_phonogram}</td>
      <td>${track.author_music}</td>
      <td>100%</td>
    </tr>
  `).join('');
  
  // Подпись лицензиара (если есть)
  const signatureHtml = signatureDataUrl 
    ? `<img src="${signatureDataUrl}" alt="Подпись" class="signature-image" />`
    : '';
  
  // Мини-подпись для страниц 1 и 2
  const miniSignatureHtml = signatureDataUrl
    ? `<img src="${signatureDataUrl}" alt="Подпись" class="mini-signature-image" />`
    : '';
  
  // Замена всех переменных в шаблоне
  const contract = CONTRACT_TEMPLATE
    .replace(/{{номер_договора}}/g, contractNumber)
    .replace(/{{дата_заключения_договора}}/g, formattedDate)
    .replace(/{{ФИО_ИП_полностью_кого}}/g, requisites.full_name)
    .replace(/{{ФИО_ИП_кратко}}/g, shortName)
    .replace(/{{graj}}/g, requisites.citizenship)
    .replace(/{{PAS}}/g, requisites.passport_data)
    .replace(/{{NIK}}/g, requisites.stage_name)
    .replace(/{{ИНН_SWIFT}}/g, requisites.inn_swift)
    .replace(/{{РЕКВИЗИТЫ_БАНК}}/g, requisites.bank_requisites.replace(/\n/g, '<br>'))
    .replace(/{{mail}}/g, requisites.email)
    .replace(/{{procc}}/g, royaltyPercent)
    .replace(/{{img}}/g, coverUrl)
    .replace(/{{TRACKS_TABLE}}/g, tracksTableRows)
    .replace(/{{SIGNATURE_LICENSOR}}/g, signatureHtml)
    .replace(/{{SIGNATURE_LICENSOR_MINI}}/g, miniSignatureHtml);
  
  return contract;
}

export function downloadContract(contractHtml: string, contractNumber: string) {
  const blob = new Blob([contractHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Договор_${contractNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}