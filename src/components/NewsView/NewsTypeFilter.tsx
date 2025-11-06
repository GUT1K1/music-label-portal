import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NewsTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  canManage: boolean;
  onCreateNews: () => void;
  onCreateJob: () => void;
}

export default function NewsTypeFilter({
  selectedType,
  onTypeChange,
  canManage,
  onCreateNews,
  onCreateJob
}: NewsTypeFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <div className="flex gap-1.5 md:gap-2 overflow-x-auto">
        <Button
          variant={selectedType === 'update' ? 'default' : 'outline'}
          onClick={() => onTypeChange('update')}
          className="text-xs md:text-sm whitespace-nowrap"
          size="sm"
        >
          Обновления
        </Button>
        <Button
          variant={selectedType === 'faq' ? 'default' : 'outline'}
          onClick={() => onTypeChange('faq')}
          className="text-xs md:text-sm whitespace-nowrap"
          size="sm"
        >
          FAQ
        </Button>
        <Button
          variant={selectedType === 'job' ? 'default' : 'outline'}
          onClick={() => onTypeChange('job')}
          className="text-xs md:text-sm whitespace-nowrap"
          size="sm"
        >
          Вакансии
        </Button>
      </div>
      {canManage && (
        <div className="flex gap-2">
          {selectedType !== 'job' && (
            <Button onClick={onCreateNews} size="sm" className="text-xs md:text-sm w-full md:w-auto">
              <Icon name="Plus" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Создать новость
            </Button>
          )}
          {selectedType === 'job' && (
            <Button onClick={onCreateJob} variant="secondary" size="sm" className="text-xs md:text-sm w-full md:w-auto">
              <Icon name="Plus" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Создать вакансию
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
