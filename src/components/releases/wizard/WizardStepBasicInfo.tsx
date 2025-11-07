import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { GENRES, LANGUAGES } from '../types';

interface WizardStepBasicInfoProps {
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
}

export default function WizardStepBasicInfo({
  newRelease,
  setNewRelease,
  coverPreview,
  handleCoverChange
}: WizardStepBasicInfoProps) {
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const handleCoverDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(true);
  }, []);

  const handleCoverDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
  }, []);

  const handleCoverDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleCoverChange(file);
      }
    }
  }, [handleCoverChange]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Основная информация</h2>
        <p className="text-sm text-muted-foreground">Заполните данные о вашем релизе</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6 items-start">
        {/* Cover */}
        <div className="space-y-2">
          <label className="text-sm font-medium block">Обложка *</label>
          <label 
            className="relative group block cursor-pointer"
            onDragEnter={handleCoverDragEnter}
            onDragLeave={handleCoverDragLeave}
            onDragOver={handleCoverDragOver}
            onDrop={handleCoverDrop}
          >
            <div className={`w-full aspect-square rounded-xl overflow-hidden bg-muted border-2 border-dashed transition-all ${
              isDraggingCover 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4">
                  <Icon name={isDraggingCover ? "Download" : "ImagePlus"} size={40} className="mb-2" />
                  <p className="text-sm font-medium">{isDraggingCover ? "Отпустите файл" : "Загрузить"}</p>
                  <p className="text-xs mt-1.5 opacity-60 text-center">или перетащите сюда</p>
                  <p className="text-[10px] mt-2 opacity-50">Минимум 3000×3000px</p>
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Название релиза *</label>
            <Input
              placeholder="Введите название альбома"
              value={newRelease.release_name}
              onChange={(e) => setNewRelease({ ...newRelease, release_name: e.target.value })}
              className="h-11"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Дата релиза *</label>
              <Input
                type="date"
                value={newRelease.release_date}
                onChange={(e) => setNewRelease({ ...newRelease, release_date: e.target.value })}
                className="h-11"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Жанр</label>
              <Select value={newRelease.genre} onValueChange={(value) => setNewRelease({ ...newRelease, genre: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Язык названия</label>
              <Select value={newRelease.title_language} onValueChange={(value) => setNewRelease({ ...newRelease, title_language: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Копирайт</label>
              <Input
                placeholder="© 2024 Artist Name"
                value={newRelease.copyright}
                onChange={(e) => setNewRelease({ ...newRelease, copyright: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Optional dates */}
      <div className="border-t pt-4">
        <details className="group">
          <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium mb-3">
            <Icon name="ChevronRight" size={16} className="transition-transform group-open:rotate-90" />
            Дополнительные даты (опционально)
          </summary>
          <div className="grid md:grid-cols-2 gap-4 pl-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Дата предзаказа</label>
              <Input
                type="date"
                value={newRelease.preorder_date}
                onChange={(e) => setNewRelease({ ...newRelease, preorder_date: e.target.value })}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Начало продаж</label>
              <Input
                type="date"
                value={newRelease.sales_start_date}
                onChange={(e) => setNewRelease({ ...newRelease, sales_start_date: e.target.value })}
                className="h-10"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
