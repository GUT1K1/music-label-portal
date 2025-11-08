import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/api';

interface FinancialReportsUploadProps {
  userId: number;
}

interface UploadResult {
  success: boolean;
  total_rows: number;
  matched_count: number;
  unmatched_count: number;
  unmatched_rows: Array<{
    row_number: number;
    artist_name: string;
    album_name: string;
    amount: number;
  }>;
  period: string;
}

export default function FinancialReportsUpload({ userId }: FinancialReportsUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('3 квартал 2024');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    '1 квартал 2024',
    '2 квартал 2024',
    '3 квартал 2024',
    '4 квартал 2024',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setError(null);
        setResult(null);
      } else {
        setError('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Выберите файл для загрузки');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        
        const response = await fetch(API_ENDPOINTS.UPLOAD_FINANCIAL_REPORT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            period: selectedPeriod,
            adminUserId: userId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка при загрузке отчёта');
        }

        setResult(data);
        setSelectedFile(null);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Upload" className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Загрузка финансового отчёта</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Период отчёта
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Файл Excel с отчётом
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 w-full bg-background/50 border-2 border-dashed border-border hover:border-primary/50 rounded-lg px-4 py-8 cursor-pointer transition-all group"
              >
                <Icon name="FileSpreadsheet" className="w-8 h-8 text-gray-400 group-hover:text-primary" />
                <div className="text-center">
                  <div className="text-white font-medium mb-1">
                    {selectedFile ? selectedFile.name : 'Выберите файл Excel'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Поддерживаются форматы .xlsx и .xls
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <Icon name="AlertCircle" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Обработка файла...
              </>
            ) : (
              <>
                <Icon name="Upload" className="w-4 h-4 mr-2" />
                Загрузить отчёт
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="CheckCircle2" className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-bold text-white">Результаты загрузки</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">{result.total_rows}</div>
              <div className="text-sm text-gray-400">Всего строк</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{result.matched_count}</div>
              <div className="text-sm text-gray-400">Найдено совпадений</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">{result.unmatched_count}</div>
              <div className="text-sm text-gray-400">Не найдено</div>
            </div>
          </div>

          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
            <Icon name="CheckCircle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-300 font-medium mb-1">
                Отчёт успешно загружен за период: {result.period}
              </p>
              <p className="text-xs text-gray-400">
                Баланс артистов автоматически обновлён
              </p>
            </div>
          </div>

          {result.unmatched_count > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
                <h4 className="text-lg font-semibold text-white">
                  Не найдены совпадения ({result.unmatched_rows.length} показано)
                </h4>
              </div>
              <div className="bg-background/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-background/70">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Строка</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Исполнитель</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Альбом</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.unmatched_rows.map((row, idx) => (
                      <tr key={idx} className="border-t border-border/30">
                        <td className="py-3 px-4 text-sm text-gray-400">{row.row_number}</td>
                        <td className="py-3 px-4 text-sm text-white">{row.artist_name}</td>
                        <td className="py-3 px-4 text-sm text-white">{row.album_name}</td>
                        <td className="py-3 px-4 text-sm text-white text-right">
                          {row.amount.toLocaleString()} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Эти записи сохранены со статусом "ожидание". Проверьте правильность имён артистов и названий релизов в базе данных.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300 space-y-2">
            <p className="font-medium text-white">Требования к файлу Excel:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Колонка G (Исполнитель) - имя артиста</li>
              <li>Колонка I (Название альбома) - название релиза</li>
              <li>Колонка O (Итого вознаграждение ЛИЦЕНЗИАРА) - сумма выплаты</li>
              <li>Система автоматически сопоставит данные с релизами в базе</li>
              <li>При успешном сопоставлении баланс артиста обновится автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
