import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ContractRequisites {
  full_name: string;
  citizenship: string;
  passport_data: string;
  inn_swift: string;
  bank_requisites: string;
  stage_name: string;
  email: string;
}

interface WizardStepRequisitesProps {
  requisites: ContractRequisites;
  onChange: (field: keyof ContractRequisites, value: string) => void;
}

const CITIZENSHIPS = [
  'Российская Федерация',
  'Украина',
  'Беларусь',
  'Казахстан',
  'Узбекистан',
  'Киргизия',
  'Таджикистан',
  'Армения',
  'Азербайджан',
  'Грузия',
  'Молдова',
  'Латвия',
  'Литва',
  'Эстония',
  'Другое'
];

const WizardStepRequisites = memo(function WizardStepRequisites({ requisites, onChange }: WizardStepRequisitesProps) {
  // Автогенерация номера договора (уникальный на основе времени)
  const contractNumber = `420-${Date.now().toString().slice(-6)}`;
  
  // Дата заключения договора (через 14 дней от текущей даты)
  const contractDate = new Date();
  contractDate.setDate(contractDate.getDate() + 14);
  const formattedDate = contractDate.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Реквизиты договора</h2>
        <p className="text-sm text-muted-foreground">
          Заполните данные для подготовки договора дистрибуции
        </p>
      </div>

      {/* Реквизиты договора */}
      <div className="space-y-4 p-4 bg-yellow-500/5 border-2 border-yellow-500/20 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
          <Icon name="FileText" size={20} />
          Реквизиты договора
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Номер договора
            </label>
            <Input
              value={contractNumber}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Генерируется автоматически</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Дата заключения договора *
            </label>
            <Input
              value={`дд.${formattedDate}`}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Выбор доступен на 14 дней вперёд</p>
          </div>
        </div>
      </div>

      {/* Личная информация */}
      <div className="space-y-4 p-4 bg-yellow-500/5 border-2 border-yellow-500/20 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
          <Icon name="User" size={20} />
          Личная информация
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Гражданство *
            </label>
            <Select 
              value={requisites.citizenship} 
              onValueChange={(value) => onChange('citizenship', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Выберите гражданство" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {CITIZENSHIPS.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              ФИО полностью (при слова) *
            </label>
            <Input
              placeholder="Иванов Иван Иванович"
              value={requisites.full_name}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\u0400-\u04FF\s-]/g, '');
                onChange('full_name', value);
              }}
              className="h-11"
              required
              minLength={5}
            />
            <p className="text-xs text-muted-foreground mt-1">Только кириллица, пробелы и дефисы</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                ФИО для подписи (формируется автоматически)
              </label>
              <Input
                value={requisites.full_name ? 
                  requisites.full_name.split(' ').map((n, i) => 
                    i === 0 ? n : n.charAt(0) + '.'
                  ).join(' ') 
                  : ''}
                disabled
                className="h-11 bg-muted"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Творческий псевдоним *
              </label>
              <Input
                placeholder="EDDIS"
                value={requisites.stage_name}
                onChange={(e) => onChange('stage_name', e.target.value)}
                className="h-11"
                required
                minLength={1}
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Паспортные данные *
            </label>
            <Input
              placeholder="1234 567890 или GER: L8V2RCZ80"
              value={requisites.passport_data}
              onChange={(e) => onChange('passport_data', e.target.value)}
              className="h-11"
              required
              minLength={5}
            />
            <p className="text-xs text-muted-foreground mt-1">Серия и номер паспорта</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              ИНН/SWIFT код *
            </label>
            <Input
              placeholder="772987898798 или SABRRUMM"
              value={requisites.inn_swift}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9A-Z]/gi, '');
                onChange('inn_swift', value);
              }}
              className="h-11"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground mt-1">Только цифры и буквы</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Банковские реквизиты для выплат *
            </label>
            <Textarea
              placeholder="Банк: Sberbank. IBAN: RU798472398472398472398847. БИК: 1234567890"
              value={requisites.bank_requisites}
              onChange={(e) => onChange('bank_requisites', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Email *
            </label>
            <Input
              type="email"
              placeholder="mr-frank-eduard@web.de"
              value={requisites.email}
              onChange={(e) => onChange('email', e.target.value.toLowerCase())}
              className="h-11"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <p className="text-xs text-muted-foreground mt-1">Действующий email адрес</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">О договоре</p>
            <p className="text-xs text-muted-foreground">
              После заполнения всех данных вам будет предложено ознакомиться с договором и поставить электронную подпись. 
              Договор будет автоматически сформирован на основе введённых данных.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WizardStepRequisites;