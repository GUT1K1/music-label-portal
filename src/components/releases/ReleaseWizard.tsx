import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import WizardStepReleaseType from './wizard/WizardStepReleaseType';
import WizardStepBasicInfo from './wizard/WizardStepBasicInfo';
import WizardStepRequisites from './wizard/WizardStepRequisites';
import WizardStepTracks from './wizard/WizardStepTracks';
import WizardStepReview from './wizard/WizardStepReview';
import WizardStepContract from './wizard/WizardStepContract';
import { Track, ContractRequisites } from './types';

interface ReleaseWizardProps {
  newRelease: {
    release_name: string;
    release_date: string;
    preorder_date: string;
    sales_start_date: string;
    genre: string;
    copyright: string;
    price_category: string;
    title_language: string;
  };
  setNewRelease: (release: any) => void;
  coverPreview: string | null;
  handleCoverChange: (file: File | null) => void;
  tracks: Track[];
  addTrack: () => void;
  removeTrack: (index: number) => void;
  updateTrack: (index: number, field: keyof Track, value: any) => void;
  moveTrack: (index: number, direction: 'up' | 'down') => void;
  handleBatchUpload: (files: FileList) => void;
  handleSubmit: (contractData?: { signature: string; pdfUrl: string; requisites: ContractRequisites }) => void;
  uploading: boolean;
  uploadProgress: number;
  currentUploadFile: string;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Тип релиза', icon: 'Music' },
  { id: 2, title: 'Информация', icon: 'Info' },
  { id: 3, title: 'Реквизиты', icon: 'FileText' },
  { id: 4, title: 'Треки', icon: 'ListMusic' },
  { id: 5, title: 'Проверка', icon: 'CheckCircle' },
  { id: 6, title: 'Договор', icon: 'FileSignature' }
];

export default function ReleaseWizard({
  newRelease,
  setNewRelease,
  coverPreview,
  handleCoverChange,
  tracks,
  addTrack,
  removeTrack,
  updateTrack,
  moveTrack,
  handleBatchUpload,
  handleSubmit,
  uploading,
  uploadProgress,
  currentUploadFile,
  onCancel
}: ReleaseWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [releaseType, setReleaseType] = useState<'single' | 'maxi-single' | 'ep' | 'album' | null>(null);
  const [requisites, setRequisites] = useState<ContractRequisites>({
    full_name: '',
    citizenship: '',
    passport_data: '',
    inn_swift: '',
    bank_requisites: '',
    stage_name: '',
    email: ''
  });
  const [contractSignature, setContractSignature] = useState<string | null>(null);
  const [contractPdfUrl, setContractPdfUrl] = useState<string | null>(null);

  const memoizedTracks = useMemo(() => tracks, [tracks]);
  const memoizedUpdateTrack = useCallback(updateTrack, [updateTrack]);
  const memoizedRemoveTrack = useCallback(removeTrack, [removeTrack]);
  const memoizedMoveTrack = useCallback(moveTrack, [moveTrack]);
  const memoizedHandleBatchUpload = useCallback(handleBatchUpload, [handleBatchUpload]);

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return releaseType !== null;
      case 2:
        // Проверка основной информации
        return newRelease.release_name.trim().length >= 1 && 
               newRelease.release_name.length <= 100 &&
               coverPreview !== null && 
               newRelease.release_date && 
               new Date(newRelease.release_date) >= new Date(new Date().toISOString().split('T')[0]) &&
               newRelease.genre && 
               newRelease.title_language;
      case 3:
        // Проверка реквизитов с валидацией
        const fullNameValid = requisites.full_name.trim().length >= 5 && /^[\u0400-\u04FF\s-]+$/.test(requisites.full_name);
        const emailValid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(requisites.email);
        const innValid = requisites.inn_swift.length >= 8 && /^[0-9A-Z]+$/i.test(requisites.inn_swift);
        
        return fullNameValid &&
               requisites.citizenship &&
               requisites.passport_data.trim().length >= 5 &&
               innValid &&
               requisites.bank_requisites.trim().length >= 10 &&
               requisites.stage_name.trim().length >= 1 &&
               emailValid;
      case 4:
        // Проверка треков
        return tracks.length > 0 && tracks.every(t => 
          t.file && 
          t.title.trim().length >= 1 && 
          t.composer.trim().length >= 1 &&
          t.author_music && t.author_music.trim().length >= 1 &&
          t.author_lyrics && t.author_lyrics.trim().length >= 1 &&
          t.author_phonogram && t.author_phonogram.trim().length >= 1 &&
          t.language_audio &&
          t.explicit_content !== null &&
          t.lyrics_text &&
          t.tiktok_preview_start !== undefined
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    handleSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
      <Card className="!bg-background !border-border/30">
        <CardHeader className="pb-4 !bg-background border-b border-border/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle className="text-xl">Создать релиз</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Шаг {currentStep} из 6</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8" disabled={uploading}>
              <Icon name="X" size={18} />
            </Button>
          </div>

          {/* Steps indicator */}
          <div className="flex gap-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex-1 flex items-center gap-2">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className={`h-1 rounded-full transition-all ${
                    step.id < currentStep ? 'bg-primary' : 
                    step.id === currentStep ? 'bg-primary/50' : 
                    'bg-muted'
                  }`} />
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      step.id < currentStep ? 'bg-primary text-primary-foreground' :
                      step.id === currentStep ? 'bg-primary/20 text-primary border-2 border-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {step.id < currentStep ? <Icon name="Check" size={14} /> : step.id}
                    </div>
                    <span className={`text-xs font-medium transition-all hidden md:inline ${
                      step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className={currentStep === 6 ? "" : "space-y-6"}>
          {/* Step content */}
          {currentStep === 1 && (
            <WizardStepReleaseType
              releaseType={releaseType}
              onSelect={setReleaseType}
            />
          )}

          {currentStep === 2 && (
            <WizardStepBasicInfo
              newRelease={newRelease}
              setNewRelease={setNewRelease}
              coverPreview={coverPreview}
              handleCoverChange={handleCoverChange}
            />
          )}

          {currentStep === 3 && (
            <WizardStepRequisites
              requisites={requisites}
              onChange={(field, value) => setRequisites({ ...requisites, [field]: value })}
            />
          )}

          {currentStep === 4 && (
            <WizardStepTracks
              tracks={memoizedTracks}
              addTrack={addTrack}
              removeTrack={memoizedRemoveTrack}
              updateTrack={memoizedUpdateTrack}
              moveTrack={memoizedMoveTrack}
              handleBatchUpload={memoizedHandleBatchUpload}
            />
          )}

          {currentStep === 5 && (
            <WizardStepReview
              newRelease={newRelease}
              coverPreview={coverPreview}
              tracks={tracks}
              releaseType={releaseType}
              uploading={uploading}
              uploadProgress={uploadProgress}
              currentUploadFile={currentUploadFile}
            />
          )}

          {currentStep === 6 && (
            <WizardStepContract
              requisites={requisites}
              releaseDate={newRelease.release_date}
              tracks={tracks}
              coverUrl={coverPreview || ''}
              onSignatureComplete={(signature, pdfUrl) => {
                setContractSignature(signature);
                setContractPdfUrl(pdfUrl);
                handleSubmit({
                  signature,
                  pdfUrl,
                  requisites
                });
              }}
              onBack={() => setCurrentStep(5)}
              uploading={uploading}
              uploadProgress={uploadProgress}
              currentUploadFile={currentUploadFile}
            />
          )}

          {/* Navigation - скрыта на шаге договора (шаг 6) */}
          {currentStep !== 6 && (
            <div className="flex gap-2 pt-4 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={uploading}
                  className="gap-2"
                >
                  <Icon name="ChevronLeft" size={16} />
                  Назад
                </Button>
              )}
              
              <div className="flex-1" />

              {currentStep < 5 ? (
                <div className="flex flex-col items-end gap-1">
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext() || uploading}
                    className="gap-2"
                  >
                    Далее
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                  {!canGoNext() && (
                    <p className="text-xs text-amber-500">Заполните все обязательные поля (*)</p>
                  )}
                </div>
              ) : currentStep === 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext() || uploading}
                  className="gap-2"
                >
                  Перейти к договору
                  <Icon name="ChevronRight" size={16} />
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}