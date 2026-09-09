import type { Language } from './common.model';

export type AccountType = 'INDIVIDUAL' | 'BUSINESS';
export type AccountStatus = 'ACTIVE' | 'PENDING' | 'REJECTED';
export type UserRole = 'VISITOR' | 'INDIVIDUAL' | 'BUSINESS';

export interface AccountPreferences {
  language: Language;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

/** Compte client La Poste (5 / 6.20 a 6.22). */
export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: AccountType;
  status: AccountStatus;
  companyName?: string;
  legalId?: string;
  preferences: AccountPreferences;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  type: AccountType;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  legalId?: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserAccount;
}

export type HistoryItemType = 'SHIPMENT' | 'POSTAGE';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  reference: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

export interface ProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
  preferences: AccountPreferences;
}
