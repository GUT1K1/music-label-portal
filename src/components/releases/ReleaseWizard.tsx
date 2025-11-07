import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import WizardStepReleaseType from './wizard/WizardStepReleaseType';
import WizardStepBasicInfo from './wizard/WizardStepBasicInfo';
import WizardStepRequisites from './wizard/WizardStepRequisites';
import WizardStepTracks from './wizard/WizardStepTracks';
import WizardStepReview from './wizard/WizardStepReview';
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
  handleSubmit: () => void;
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
  { id: 5, title: 'Проверка', icon: 'CheckCircle' }
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
  const [releaseType, setReleaseType] = useState<'single' | 'album' | 'ep' | null>(null);
  const [requisites, setRequisites] = useState<ContractRequisites>({
    full_name: '',
    citizenship: '',
    passport_data: '',
    inn_swift: '',
    bank_requisites: '',
    stage_name: '',
    email: ''
  });

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return releaseType !== null;
      case 2:
        return newRelease.release_name && 
               coverPreview && 
               newRelease.release_date && 
               newRelease.genre && 
               newRelease.title_language;
      case 3:
        return requisites.full_name &&
               requisites.citizenship &&
               requisites.passport_data &&
               requisites.inn_swift &&
               requisites.bank_requisites &&
               requisites.stage_name &&
               requisites.email;
      case 4:
        return tracks.length > 0 && tracks.every(t => 
          t.file && 
          t.title && 
          t.composer &&
          t.author_music &&
          t.author_lyrics &&
          t.author_phonogram &&
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
    if (canGoNext() && currentStep < 5) {
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle className="text-xl">Создать релиз</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Шаг {currentStep} из 5</p>
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

        <CardContent className="space-y-6">
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
              tracks={tracks}
              addTrack={addTrack}
              removeTrack={removeTrack}
              updateTrack={updateTrack}
              moveTrack={moveTrack}
              handleBatchUpload={handleBatchUpload}
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

          {/* Navigation */}
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
              <Button
                onClick={handleNext}
                disabled={!canGoNext() || uploading}
                className="gap-2"
              >
                Далее
                <Icon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={uploading || !canGoNext()}
                className="gap-2"
              >
                <Icon name={uploading ? 'Loader2' : 'Send'} size={16} className={uploading ? 'animate-spin' : ''} />
                {uploading ? 'Отправка...' : 'Отправить на модерацию'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}