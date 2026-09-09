import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Toast, ToastInput } from './toast.model';

/**
 * Actions du système de notifications toast.
 * N'importe quel effect métier peut les dispatcher pour informer l'utilisateur.
 */
export const ToastActions = createActionGroup({
  source: 'Toast',
  events: {
    Show: props<{ toast: ToastInput }>(),
    Success: props<{ message: string; title?: string }>(),
    Error: props<{ message: string; title?: string }>(),
    Info: props<{ message: string; title?: string }>(),
    Warning: props<{ message: string; title?: string }>(),
    Added: props<{ toast: Toast }>(),
    Dismiss: props<{ id: string }>(),
    'Clear All': emptyProps(),
  },
});
