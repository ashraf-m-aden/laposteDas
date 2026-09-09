import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastActions } from './toast.actions';
import type { ToastInput } from './toast.model';
import { selectAllToasts, selectHasToasts } from './toast.selectors';

/**
 * Façade des notifications toast : seule API exposée aux composants et services.
 * Aucun composant ne touche au store directement.
 */
@Injectable({ providedIn: 'root' })
export class ToastFacade {
  private readonly store = inject(Store);

  readonly toasts = toSignal(this.store.select(selectAllToasts), { initialValue: [] });
  readonly hasToasts = toSignal(this.store.select(selectHasToasts), { initialValue: false });

  readonly toasts$ = this.store.select(selectAllToasts);

  show(toast: ToastInput): void {
    this.store.dispatch(ToastActions.show({ toast }));
  }

  success(message: string, title?: string): void {
    this.store.dispatch(ToastActions.success({ message, title }));
  }

  error(message: string, title?: string): void {
    this.store.dispatch(ToastActions.error({ message, title }));
  }

  info(message: string, title?: string): void {
    this.store.dispatch(ToastActions.info({ message, title }));
  }

  warning(message: string, title?: string): void {
    this.store.dispatch(ToastActions.warning({ message, title }));
  }

  dismiss(id: string): void {
    this.store.dispatch(ToastActions.dismiss({ id }));
  }

  clearAll(): void {
    this.store.dispatch(ToastActions.clearAll());
  }
}
