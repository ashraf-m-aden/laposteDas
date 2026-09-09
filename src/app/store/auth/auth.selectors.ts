import { createSelector } from '@ngrx/store';
import type { UserRole } from '../../core/models';
import { authFeature } from './auth.reducer';

export const selectUser = authFeature.selectUser;
export const selectToken = authFeature.selectToken;
export const selectAuthStatus = authFeature.selectStatus;
export const selectAuthError = authFeature.selectError;
export const selectHistory = authFeature.selectHistory;
export const selectHistoryStatus = authFeature.selectHistoryStatus;

export const selectAuthInitialized = authFeature.selectInitialized;

export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);

export const selectIsLoading = createSelector(selectAuthStatus, (status) => status === 'loading');

/** Rôle courant au sens de la section 5 du cahier des charges. */
export const selectRole = createSelector(selectUser, (user): UserRole => {
  if (!user) {
    return 'VISITOR';
  }
  return user.type === 'BUSINESS' ? 'BUSINESS' : 'INDIVIDUAL';
});

export const selectIsBusiness = createSelector(selectRole, (role) => role === 'BUSINESS');

export const selectDisplayName = createSelector(selectUser, (user) =>
  user ? user.companyName ?? `${user.firstName} ${user.lastName}` : '',
);

export const selectHistoryTotal = createSelector(selectHistory, (items) =>
  items.reduce((total, item) => total + item.amount, 0),
);

/**
 * Un seul sélectionneur pour les gardes : lire `initialized` et le rôle depuis
 * deux flux séparés produit un état incohérent le temps d'une émission.
 */
export const selectAuthGate = createSelector(
  selectAuthInitialized,
  selectIsAuthenticated,
  selectIsBusiness,
  (initialized, isAuthenticated, isBusiness) => ({ initialized, isAuthenticated, isBusiness }),
);
