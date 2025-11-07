import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ContractRequisites, Track } from './types';
import { generateContract } from './contract/generateContract';

interface ContractViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractPdfUrl: string;
  requisites?: ContractRequisites;
  releaseTitle?: string;
  releaseDate?: string;
  tracks?: Track[];
  coverUrl?: string;
  signatureDataUrl?: string;
}

export default function ContractViewDialog({
  open,
  onOpenChange,
  contractPdfUrl,
  requisites,
  releaseTitle,
  releaseDate,
  tracks = [],
  coverUrl = '',
  signatureDataUrl
}: ContractViewDialogProps) {
  const [contractHtml, setContractHtml] = useState<string>('');

  useEffect(() => {
    if (open && requisites && releaseDate && tracks.length > 0) {
      console.log('🔍 ContractViewDialog signatureDataUrl:', signatureDataUrl);
      const html = generateContract({
        requisites,
        releaseDate,
        tracks,
        coverUrl,
        signatureDataUrl
      });
      setContractHtml(html);
    }
  }, [open, requisites, releaseDate, tracks, coverUrl, signatureDataUrl]);

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

        {/* HTML-версия договора (как на шаге 6) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-background">
          {contractHtml ? (
            <div 
              className="contract-preview"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-md">
                Загрузка договора...
              </p>
            </div>
          )}
        </div>

        {/* Footer с подсказкой */}
        <div className="px-6 py-3 border-t bg-muted/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>
              Для сохранения договора в PDF используйте кнопку "Скачать PDF" выше
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}