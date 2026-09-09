import type { HistoryItem, UserAccount, ViewStatus } from '../../core/models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  /** Passe à true dès que la session mémorisée a été résolue (succès ou échec). */
  initialized: boolean;
  user: UserAccount | null;
  token: string | null;
  status: ViewStatus;
  error: string | null;
  history: HistoryItem[];
  historyStatus: ViewStatus;
}

export const initialAuthState: AuthState = {
  initialized: false,
  user: null,
  token: null,
  status: 'idle',
  error: null,
  history: [],
  historyStatus: 'idle',
};
