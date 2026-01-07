
export enum ChatType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
  CHANNEL = 'CHANNEL'
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: ChatType;
  lastMessage?: Message;
  unreadCount: number;
  isOnline?: boolean;
  isPinned?: boolean;
  username?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  phone: string;
  email: string;
}

export type Language = 'en' | 'ru';

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  chatWallpaper: string;
  notifications: boolean;
  animations: boolean;
  language: Language;
}
