import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ContractRequisites } from './types';

interface ContractViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractPdfUrl: string;
  requisites?: ContractRequisites;
  releaseTitle?: string;
}

export default function ContractViewDialog({
  open,
  onOpenChange,
  contractPdfUrl,
  requisites,
  releaseTitle
}: ContractViewDialogProps) {
  const handleDownload = () => {
    window.open(contractPdfUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold mb-1">
                Лицензионный договор
              </DialogTitle>
              {releaseTitle && (
                <p className="text-sm text-muted-foreground">
                  Релиз: {releaseTitle}
                </p>
              )}
            </div>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2 border-primary/30"
            >
              <Icon name="Download" size={16} />
              Скачать PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Реквизиты (опционально) */}
        {requisites && (
          <div className="px-6 py-3 bg-muted/30 border-b">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 hover:text-primary transition-colors">
                <Icon name="ChevronRight" size={14} className="group-open:rotate-90 transition-transform" />
                Реквизиты артиста
              </summary>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                <p><strong>ФИО:</strong> {requisites.full_name}</p>
                <p><strong>Псевдоним:</strong> {requisites.stage_name}</p>
                <p><strong>Гражданство:</strong> {requisites.citizenship}</p>
                <p><strong>Паспорт:</strong> {requisites.passport_data}</p>
                <p><strong>ИНН/SWIFT:</strong> {requisites.inn_swift}</p>
                <p><strong>Email:</strong> {requisites.email}</p>
                <p><strong>Банковские реквизиты:</strong></p>
                <pre className="whitespace-pre-wrap font-mono text-xs ml-4">{requisites.bank_requisites}</pre>
              </div>
            </details>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-muted/20">
          <iframe
            src={contractPdfUrl}
            className="w-full h-full border-0"
            title="Предпросмотр договора"
          />
        </div>

        {/* Footer с подсказкой */}
        <div className="px-6 py-3 border-t bg-muted/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>
              Если документ не отображается, используйте кнопку "Скачать PDF" выше
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
