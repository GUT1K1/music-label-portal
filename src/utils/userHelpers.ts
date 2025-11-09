import { User } from '@/types';

export function normalizeUser(userData: any): User {
  if (!userData) return userData;
  
  const normalized = { ...userData };

  if (normalized.vk_photo) {
    normalized.avatar = normalized.vk_photo;
  }
  if (normalized.avatar) {
    normalized.vk_photo = normalized.avatar;
  }

  if (normalized.full_name) {
    normalized.fullName = normalized.full_name;
  }
  if (normalized.fullName) {
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