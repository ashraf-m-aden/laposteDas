import { createFeature, createReducer, on } from '@ngrx/store';
import { ToastActions } from './toast.actions';
import { TOAST_FEATURE_KEY, initialToastState } from './toast.state';

export const toastFeature = createFeature({
  name: TOAST_FEATURE_KEY,
  reducer: createReducer(
    initialToastState,
    on(ToastActions.added, (state, { toast }) => ({
      ...state,
      // La pile reste courte : au-delà de 4 toasts, la plus ancienne disparaît.
      toasts: [...state.toasts, toast].slice(-4),
    })),
    on(ToastActions.dismiss, (state, { id }) => ({
      ...state,
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
    on(ToastActions.clearAll, (state) => ({ ...state, toasts: [] })),
  ),
});

export const { name: toastFeatureKey, reducer: toastReducer, selectToasts } = toastFeature;
