import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeUntil, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastActions } from './toast.actions';
import type { Toast, ToastInput, ToastType } from './toast.model';

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: 'Succès',
  error: 'Erreur',
  info: 'Information',
  warning: 'Attention',
};

function buildToast(input: ToastInput): Toast {
  const type = input.type ?? 'info';
  return {
    id: `TOAST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: input.title ?? DEFAULT_TITLES[type],
    message: input.message,
    durationMs: input.durationMs ?? (type === 'error' ? 8000 : environment.toastDurationMs),
    dismissible: input.dismissible ?? true,
  };
}

@Injectable()
export class ToastEffects {
  private readonly actions$ = inject(Actions);

  /** Raccourcis typés -> action générique `show`. */
  readonly shortcuts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToastActions.success, ToastActions.error, ToastActions.info, ToastActions.warning),
      map((action) => {
        const type: ToastType =
          action.type === ToastActions.success.type
            ? 'success'
            : action.type === ToastActions.error.type
              ? 'error'
              : action.type === ToastActions.warning.type
                ? 'warning'
                : 'info';
        return ToastActions.show({
          toast: { type, message: action.message, title: action.title },
        });
      }),
    ),
  );

  /** Construit la notification (id, titre par défaut, durée) puis l'ajoute au store. */
  readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToastActions.show),
      map(({ toast }) => ToastActions.added({ toast: buildToast(toast) })),
    ),
  );

  /** Fermeture automatique, annulée si l'utilisateur ferme la notification avant. */
  readonly autoDismiss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToastActions.added),
      filter(({ toast }) => toast.durationMs > 0),
      mergeMap(({ toast }) =>
        timer(toast.durationMs).pipe(
          map(() => ToastActions.dismiss({ id: toast.id })),
          takeUntil(
            this.actions$.pipe(
              ofType(ToastActions.dismiss, ToastActions.clearAll),
              filter((action) => !('id' in action) || action.id === toast.id),
            ),
          ),
        ),
      ),
    ),
  );
}
