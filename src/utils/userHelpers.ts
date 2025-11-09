import { User } from '@/types';

export function normalizeUser(userData: any): User {
  const normalized = { ...userData };

  if (normalized.vk_photo && !normalized.avatar) {
    normalized.avatar = normalized.vk_photo;
  } else if (normalized.avatar && !normalized.vk_photo) {
    normalized.vk_photo = normalized.avatar;
  }

  if (normalized.full_name && !normalized.fullName) {
    normalized.fullName = normalized.full_name;
  } else if (normalized.fullName && !normalized.full_name) {
    normalized.full_name = normalized.fullName;
  }

  return normalized as User;
}

export function getUserAvatar(user: User): string | undefined {
  return user.avatar || user.vk_photo;
}

export function getUserFullName(user: User): string {
  return user.fullName || user.full_name || user.username;
}
