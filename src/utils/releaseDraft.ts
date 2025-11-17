import { Track } from '@/components/releases/types';

export interface ReleaseDraft {
  id: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  releaseType: 'single' | 'maxi-single' | 'ep' | 'album' | null;
  currentStep: number;
  newRelease: {
    release_name: string;
    artist_name: string;
    release_date: string;
    preorder_date: string;
    sales_start_date: string;
    genre: string;
    copyright: string;
    price_category: string;
    title_language: string;
  };
  coverPreview: string | null;
  tracks: Array<Omit<Track, 'file' | 'preview_url'>>;
  requisites?: {
    full_name: string;
    citizenship: string;
    passport_data: string;
    inn_swift: string;
    bank_requisites: string;
    stage_name: string;
    email: string;
  };
}

const DRAFT_KEY_PREFIX = 'release_draft_';
const DRAFTS_LIST_KEY = 'release_drafts_list';
const AUTO_SAVE_INTERVAL = 30000; // 30 секунд

export const saveDraft = (draft: ReleaseDraft): void => {
  try {
    const draftKey = `${DRAFT_KEY_PREFIX}${draft.id}`;
    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(draftKey, JSON.stringify(updatedDraft));
    
    // Обновляем список черновиков
    const drafts = getDraftsList();
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = {
        id: draft.id,
        userId: draft.userId,
        release_name: draft.newRelease.release_name || 'Новый релиз',
        updatedAt: updatedDraft.updatedAt,
        releaseType: draft.releaseType,
        tracksCount: draft.tracks.length
      };
    } else {
      drafts.push({
        id: draft.id,
        userId: draft.userId,
        release_name: draft.newRelease.release_name || 'Новый релиз',
        updatedAt: updatedDraft.updatedAt,
        releaseType: draft.releaseType,
        tracksCount: draft.tracks.length
      });
    }
    
    localStorage.setItem(DRAFTS_LIST_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = (draftId: string): ReleaseDraft | null => {
  try {
    const draftKey = `${DRAFT_KEY_PREFIX}${draftId}`;
    const draftJson = localStorage.getItem(draftKey);
    
    if (!draftJson) return null;
    
    return JSON.parse(draftJson);
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

export const deleteDraft = (draftId: string): void => {
  try {
    const draftKey = `${DRAFT_KEY_PREFIX}${draftId}`;
    localStorage.removeItem(draftKey);
    
    // Обновляем список черновиков
    const drafts = getDraftsList();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem(DRAFTS_LIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
};

export const getDraftsList = (): Array<{
  id: string;
  userId: number;
  release_name: string;
  updatedAt: string;
  releaseType: 'single' | 'maxi-single' | 'ep' | 'album' | null;
  tracksCount: number;
}> => {
  try {
    const draftsJson = localStorage.getItem(DRAFTS_LIST_KEY);
    if (!draftsJson) return [];
    
    const drafts = JSON.parse(draftsJson);
    // Сортировать по дате обновления (новые первыми)
    return drafts.sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to load drafts list:', error);
    return [];
  }
};

export const getUserDrafts = (userId: number) => {
  const allDrafts = getDraftsList();
  return allDrafts.filter(d => d.userId === userId);
};

export const createDraftId = (): string => {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const AUTO_SAVE_INTERVAL_MS = AUTO_SAVE_INTERVAL;
