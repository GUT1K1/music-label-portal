export interface SupportThread {
  id: number;
  subject: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'normal' | 'urgent';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  artist_username?: string;
  artist_name?: string;
  artist_avatar?: string;
  artist_vk_photo?: string;
  with_user_name?: string;
  with_user_avatar?: string;
  last_message?: string;
  unread_count?: number;
  rating?: number;
  release_id?: number;
  track_id?: number;
  release_title?: string;
  release_cover?: string;
  track_title?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  attachment_name?: string;
  sender_name?: string;
  sender_role?: string;
}

export interface Artist {
  id: number;
  username: string;
  full_name: string;
  avatar?: string;
  vk_photo?: string;
}

export interface Release {
  id: number;
  title: string;
  cover_url?: string;
  status: string;
}

export interface Track {
  id: number;
  title: string;
  release_id: number;
  release_title: string;
}

export interface SupportChatProps {
  userId: number;
  userRole: 'artist' | 'manager' | 'director';
}