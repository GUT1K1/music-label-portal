export interface UserDB {
  id: number;
  username: string;
  role: 'artist' | 'manager' | 'director';
  full_name: string;
  vk_photo: string | null;
  vk_email: string | null;
  vk_first_name: string | null;
  vk_last_name: string | null;
  telegram_id: string | null;
  telegram_chat_id: string | null;
  balance: number;
  revenue_share_percent: number | null;
  is_blocked: boolean;
  is_frozen: boolean;
  frozen_until: string | null;
  blocked_reason: string | null;
  created_at: string;
  yandex_music_url: string | null;
  vk_group_url: string | null;
  tiktok_url: string | null;
  social_links_filled: boolean;
  last_ip: string | null;
  device_fingerprint: string | null;
}

export interface TicketDB {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_by: number;
  creator_name: string;
  created_at: string;
  assigned_to: number | null;
  assigned_name: string | null;
  deadline: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  tasks_total: number;
  tasks_completed: number;
}

export interface ReleaseDB {
  id: number;
  artist_id: number;
  artist_name: string;
  title: string;
  release_date: string;
  status: string;
  cover_url: string | null;
  created_at: string;
}

export interface MessageDB {
  id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  is_read: boolean;
  sent_at: string;
  sender_name: string;
  receiver_name: string;
}

export interface NotificationDB {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link: string | null;
}
