import { User } from '@/types';

export function normalizeUser(userData: any): User {
  if (!userData) return userData;
  
  const normalized = { ...userData };

  // Нормализация аватара - ищем в разных полях
  const avatarSource = normalized.avatar || normalized.vk_photo || normalized.photo;
  if (avatarSource) {
    normalized.avatar = avatarSource;
    normalized.vk_photo = avatarSource;
  }

  // Нормализация имени
  const nameSource = normalized.full_name || normalized.fullName;
  if (nameSource) {
    normalized.full_name = nameSource;
    normalized.fullName = nameSource;
  }

  return normalized as User;
}

export function getUserAvatar(user: User): string | undefined {
  return user.avatar || user.vk_photo;
}

export function getUserFullName(user: User): string {
  return user.fullName || user.full_name || user.username;
}