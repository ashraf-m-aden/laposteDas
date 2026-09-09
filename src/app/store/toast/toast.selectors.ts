import { createSelector } from '@ngrx/store';
import { toastFeature } from './toast.reducer';

export const selectAllToasts = toastFeature.selectToasts;

export const selectToastCount = createSelector(selectAllToasts, (toasts) => toasts.length);

export const selectHasToasts = createSelector(selectToastCount, (count) => count > 0);
