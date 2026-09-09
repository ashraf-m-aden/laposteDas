import type { Toast } from './toast.model';

export const TOAST_FEATURE_KEY = 'toast';

export interface ToastState {
  toasts: Toast[];
}

export const initialToastState: ToastState = {
  toasts: [],
};
