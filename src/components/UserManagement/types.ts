export interface User {
  id: number;
  username: string;
  role: 'artist' | 'manager' | 'director';
  full_name: string;
  revenue_share_percent?: number;
  is_blocked?: boolean;
  is_frozen?: boolean;
  frozen_until?: string;
  blocked_reason?: string;
  last_ip?: string;
  device_fingerprint?: string;
  telegram_id?: string;
  telegram_username?: string;
  telegram_first_name?: string;
  telegram_last_name?: string;
  email?: string;
  vk_email?: string;
  balance?: number;
  created_at?: string;
  yandex_music_url?: string;
  vk_group_url?: string;
  tiktok_url?: string;
  vk_id?: string;
  vk_first_name?: string;
  vk_last_name?: string;
  email_verified?: boolean;
  two_factor_enabled?: boolean;
}

export interface UserManagementProps {
  allUsers: User[];
  newUser: {
    username: string;
    full_name: string;
    role: string;
    revenue_share_percent?: number;
  };
  onNewUserChange: (user: { username: string; full_name: string; role: string; revenue_share_percent?: number }) => void;
  onCreateUser: () => void;
  onBlockUser?: (userId: number, reason: string, permanent: boolean) => void;
  onUnblockUser?: (userId: number) => void;
  onFreezeUser?: (userId: number, until: Date) => void;
  onUnfreezeUser?: (userId: number) => void;
  onUpdateUser?: (userId: number, userData: Partial<User>) => void;
  isUserOnline?: (userId: number) => boolean;
  getUserLastSeen?: (userId: number) => string;
}
