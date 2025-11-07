export interface Track {
  id: number;
  track_number: number;
  title: string;
  file_url: string;
  file_name: string;
  composer: string;
  author_lyrics?: string;
  author_phonogram?: string;
  language_audio: string;
  lyrics_text?: string;
  explicit_content?: boolean;
  tiktok_preview_start?: number;
}

export interface Pitching {
  id: number;
  release_id: number;
  artist_name: string;
  release_name: string;
  release_date: string;
  genre: string;
  artist_description: string;
  release_description: string;
  playlist_fit: string;
  current_reach: string;
  preview_link: string;
  status: string;
  created_at: string;
}

export interface ContractRequisites {
  full_name: string;
  stage_name: string;
  citizenship: string;
  passport_data: string;
  inn_swift: string;
  email: string;
  bank_requisites: string;
}

export interface Release {
  id: number;
  release_name: string;
  artist_name: string;
  user_id?: number;
  cover_url?: string;
  release_date?: string;
  preorder_date?: string;
  sales_start_date?: string;
  genre?: string;
  copyright?: string;
  price_category?: string;
  title_language?: string;
  status: string;
  tracks_count?: number;
  created_at: string;
  tracks?: Track[];
  review_comment?: string;
  reviewer_id?: number;
  reviewer_name?: string;
  pitching?: Pitching | null;
  contract_pdf_url?: string;
  contract_requisites?: ContractRequisites;
  contract_signature?: string;
}