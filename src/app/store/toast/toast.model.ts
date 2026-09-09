export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  /** Durée d'affichage en ms ; 0 = notification persistante. */
  durationMs: number;
  dismissible: boolean;
}

export type ToastInput = Partial<Omit<Toast, 'id'>> & { message: string };
