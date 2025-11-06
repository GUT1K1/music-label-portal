import { UserDB } from '@/types/database';
import { UserAPI, UpdateUserRequest, APIResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { ensureNumber, ensureString } from '@/utils/transforms';

export class UserService {
  static transformDBToAPI(dbUser: UserDB): UserAPI {
    return {
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
      fullName: dbUser.full_name,
      avatar: dbUser.vk_photo || undefined,
      email: dbUser.email || dbUser.vk_email || undefined,
      vkFirstName: dbUser.vk_first_name || undefined,
      vkLastName: dbUser.vk_last_name || undefined,
      telegramId: dbUser.telegram_id || undefined,
      telegramChatId: dbUser.telegram_chat_id || undefined,
      balance: ensureNumber(dbUser.balance),
      revenueSharePercent: dbUser.revenue_share_percent !== null ? dbUser.revenue_share_percent : undefined,
      isBlocked: Boolean(dbUser.is_blocked),
      isFrozen: Boolean(dbUser.is_frozen),
      frozenUntil: dbUser.frozen_until || undefined,
      blockedReason: dbUser.blocked_reason || undefined,
      createdAt: dbUser.created_at,
      yandexMusicUrl: dbUser.yandex_music_url || undefined,
      vkGroupUrl: dbUser.vk_group_url || undefined,
      tiktokUrl: dbUser.tiktok_url || undefined,
      socialLinksFilled: Boolean(dbUser.social_links_filled),
      lastIp: dbUser.last_ip || undefined,
      passwordHash: dbUser.password_hash || undefined,
      deviceFingerprint: dbUser.device_fingerprint || undefined
    };
  }

  static transformAPIToDB(apiUser: Partial<UpdateUserRequest>): Record<string, any> {
    const dbData: Record<string, any> = {};

    if (apiUser.fullName !== undefined) {
      dbData.full_name = apiUser.fullName;
    }
    if (apiUser.avatar !== undefined) {
      dbData.vk_photo = apiUser.avatar;
    }
    if (apiUser.email !== undefined) {
      dbData.vk_email = apiUser.email;
    }
    if (apiUser.balance !== undefined) {
      dbData.balance = apiUser.balance;
    }
    if (apiUser.revenueSharePercent !== undefined) {
      dbData.revenue_share_percent = apiUser.revenueSharePercent;
    }
    if (apiUser.role !== undefined) {
      dbData.role = apiUser.role;
    }

    return dbData;
  }

  static async getUser(userId: number, requesterId: number): Promise<UserAPI> {
    const response = await fetch(`${API_ENDPOINTS.USERS}?id=${userId}`, {
      headers: {
        'X-User-Id': requesterId.toString()
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const dbUser: UserDB = await response.json();
    return this.transformDBToAPI(dbUser);
  }

  static async getAllUsers(requesterId: number): Promise<UserAPI[]> {
    const response = await fetch(API_ENDPOINTS.USERS, {
      headers: {
        'X-User-Id': requesterId.toString()
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const dbUsers: UserDB[] = await response.json();
    return dbUsers.map(u => this.transformDBToAPI(u));
  }

  static async updateUser(userId: number, updates: Partial<UpdateUserRequest>, requesterId: number): Promise<boolean> {
    const dbData = this.transformAPIToDB(updates);
    const payload = { id: userId, ...dbData };

    const response = await fetch(API_ENDPOINTS.USERS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': requesterId.toString()
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  static async getManagers(requesterId: number): Promise<UserAPI[]> {
    const allUsers = await this.getAllUsers(requesterId);
    return allUsers.filter(u => u.role === 'manager' || u.role === 'director');
  }
}