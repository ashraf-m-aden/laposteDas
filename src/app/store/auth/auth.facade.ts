import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { Credentials, ProfilePayload, RegisterPayload } from '../../core/models';
import { AuthActions } from './auth.actions';
import {
  selectAuthError,
  selectAuthStatus,
  selectDisplayName,
  selectHistory,
  selectHistoryStatus,
  selectHistoryTotal,
  selectIsAuthenticated,
  selectIsBusiness,
  selectIsLoading,
  selectRole,
  selectUser,
} from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly user = toSignal(this.store.select(selectUser), { initialValue: null });
  readonly isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), {
    initialValue: false,
  });
  readonly isBusiness = toSignal(this.store.select(selectIsBusiness), { initialValue: false });
  readonly role = toSignal(this.store.select(selectRole), { initialValue: 'VISITOR' as const });
  readonly displayName = toSignal(this.store.select(selectDisplayName), { initialValue: '' });
  readonly status = toSignal(this.store.select(selectAuthStatus), { initialValue: 'idle' as const });
  readonly loading = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectAuthError), { initialValue: null });
  readonly history = toSignal(this.store.select(selectHistory), { initialValue: [] });
  readonly historyStatus = toSignal(this.store.select(selectHistoryStatus), {
    initialValue: 'idle' as const,
  });
  readonly historyTotal = toSignal(this.store.select(selectHistoryTotal), { initialValue: 0 });

  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly user$ = this.store.select(selectUser);

  restoreSession(): void {
    this.store.dispatch(AuthActions.restoreSession());
  }

  login(credentials: Credentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  register(payload: RegisterPayload): void {
    this.store.dispatch(AuthActions.register({ payload }));
  }

  updateProfile(payload: ProfilePayload): void {
    this.store.dispatch(AuthActions.updateProfile({ payload }));
  }

  loadHistory(): void {
    this.store.dispatch(AuthActions.loadHistory());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
