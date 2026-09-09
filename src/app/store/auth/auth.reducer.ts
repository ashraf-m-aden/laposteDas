import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AUTH_FEATURE_KEY, initialAuthState } from './auth.state';

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.login, AuthActions.register, AuthActions.updateProfile, (state) => ({
      ...state,
      status: 'loading' as const,
      error: null,
    })),
    on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { session }) => ({
      ...state,
      initialized: true,
      user: session.user,
      token: session.token,
      status: 'loaded' as const,
      error: null,
    })),
    on(
      AuthActions.loginFailure,
      AuthActions.registerFailure,
      AuthActions.updateProfileFailure,
      (state, { error }) => ({
        ...state,
        status: 'error' as const,
        error: error.message,
      }),
    ),
    on(
      AuthActions.loadProfileSuccess,
      AuthActions.updateProfileSuccess,
      (state, { user }) => ({
        ...state,
        initialized: true,
        user,
        status: 'loaded' as const,
        error: null,
      }),
    ),
    on(AuthActions.loadProfileFailure, (state) => ({
      ...state,
      initialized: true,
      user: null,
      token: null,
      status: 'idle' as const,
    })),
    on(AuthActions.loadHistory, (state) => ({ ...state, historyStatus: 'loading' as const })),
    on(AuthActions.loadHistorySuccess, (state, { items }) => ({
      ...state,
      history: items,
      historyStatus: items.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(AuthActions.loadHistoryFailure, (state) => ({
      ...state,
      historyStatus: 'error' as const,
    })),
    on(AuthActions.logoutSuccess, () => ({ ...initialAuthState, initialized: true })),
  ),
});
