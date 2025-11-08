import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/api';

interface FinancialReportsUploadProps {
  userId: number;
}

interface UploadJob {
  id: number;
  period: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  matched_count: number;
  unmatched_count: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export default function FinancialReportsUpload({ userId }: FinancialReportsUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('3 квартал 2024');
  const [uploading, setUploading] = useState(false);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    '1 квартал 2024',
    '2 квартал 2024',
    '3 квартал 2024',
    '4 квартал 2024',
  ];

  const loadJobs = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_FINANCIAL_REPORT, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        }
      });
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  useEffect(() => {
    console.log('🔄 FinancialReportsUpload mounted');
    loadJobs();
    
    const interval = setInterval(() => {
      const hasActiveJobs = jobs.some(j => j.status === 'pending' || j.status === 'processing');
      if (hasActiveJobs) {
        loadJobs();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [jobs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setError(null);
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
      
      reader.onerror = () => {
        setError('Ошибка чтения файла');
        setUploading(false);
      };
      
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        
        const response = await fetch(API_ENDPOINTS.UPLOAD_FINANCIAL_REPORT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            period: selectedPeriod,
            adminUserId: userId,
            filename: selectedFile.name
          })
        });

        const data = await response.json();

        if (response.ok) {
          setSelectedFile(null);
          loadJobs();
        } else {
          throw new Error(data.error || 'Ошибка при загрузке отчёта');
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Icon name="Clock" className="w-5 h-5 text-gray-400" />;
      case 'processing': return <Icon name="Loader2" className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed': return <Icon name="CheckCircle2" className="w-5 h-5 text-green-500" />;
      case 'failed': return <Icon name="XCircle" className="w-5 h-5 text-red-500" />;
      default: return <Icon name="HelpCircle" className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'В очереди';
      case 'processing': return 'Обрабатывается';
      case 'completed': return 'Завершено';
      case 'failed': return 'Ошибка';
      default: return status;
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
                Загрузка файла...
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

      {jobs.length > 0 && (
        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="History" className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-bold text-white">История загрузок</h3>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="bg-background/50 rounded-lg p-4 border border-border/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{job.period}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {getStatusText(job.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {job.filename}
                      </div>
                      
                      {job.status === 'processing' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Обработано строк</span>
                            <span>{job.processed_rows.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-background/80 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-300"
                              style={{ width: job.total_rows > 0 ? `${(job.processed_rows / job.total_rows) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      )}

                      {job.status === 'completed' && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
                            <div className="text-xs text-gray-400">Найдено</div>
                            <div className="text-lg font-bold text-green-400">{job.matched_count}</div>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded px-3 py-2">
                            <div className="text-xs text-gray-400">Не найдено</div>
                            <div className="text-lg font-bold text-orange-400">{job.unmatched_count}</div>
                          </div>
                        </div>
                      )}

                      {job.status === 'failed' && job.error_message && (
                        <div className="mt-2 text-xs text-red-400">
                          Ошибка: {job.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-right whitespace-nowrap">
                    {new Date(job.created_at).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300 space-y-2">
            <p className="font-medium text-white">Как работает загрузка:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Файл обрабатывается в фоновом режиме — это займёт несколько минут</li>
              <li>Вы можете закрыть страницу, обработка продолжится</li>
              <li>Статус обновляется автоматически каждые 3 секунды</li>
              <li>После завершения баланс артистов обновится автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}