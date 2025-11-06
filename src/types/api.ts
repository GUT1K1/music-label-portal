export interface UserAPI {
  id: number;
  username: string;
  role: 'artist' | 'manager' | 'director';
  fullName: string;
  avatar?: string;
  email?: string;
  vkFirstName?: string;
  vkLastName?: string;
  telegramId?: string;
  telegramChatId?: string;
  balance: number;
  revenueSharePercent?: number;
  isBlocked: boolean;
  isFrozen: boolean;
  frozenUntil?: string;
  blockedReason?: string;
  createdAt: string;
  yandexMusicUrl?: string;
  vkGroupUrl?: string;
  tiktokUrl?: string;
  socialLinksFilled: boolean;
  lastIp?: string;
  deviceFingerprint?: string;
  passwordHash?: string;
}

export interface TicketAPI {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: number;
  creatorName: string;
  createdAt: string;
  assignedTo?: number;
  assignedName?: string;
  deadline?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  tasksTotal: number;
  tasksCompleted: number;
}

export interface ReleaseAPI {
  id: number;
  artistId: number;
  artistName: string;
  title: string;
  releaseDate: string;
  status: string;
  coverUrl?: string;
  createdAt: string;
}

export interface MessageAPI {
  id: number;
  senderId: number;
  receiverId: number;
  messageText: string;
  isRead: boolean;
  sentAt: string;
  senderName: string;
  receiverName: string;
}

export interface NotificationAPI {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NewUserRequest {
  username: string;
  fullName: string;
  role: 'artist' | 'manager' | 'director';
}

export interface UpdateUserRequest {
  id: number;
  fullName?: string;
  avatar?: string;
  email?: string;
  balance?: number;
  revenueSharePercent?: number;
  role?: 'artist' | 'manager' | 'director';
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}