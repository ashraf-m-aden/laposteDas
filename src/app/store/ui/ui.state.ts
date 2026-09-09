import type { Language } from '../../core/models';

export const UI_FEATURE_KEY = 'ui';

export interface UiState {
  language: Language;
  mobileMenuOpen: boolean;
  online: boolean;
}

export const initialUiState: UiState = {
  language: 'fr',
  mobileMenuOpen: false,
  online: true,
};
