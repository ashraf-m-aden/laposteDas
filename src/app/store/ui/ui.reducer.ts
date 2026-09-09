import { createFeature, createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';
import { UI_FEATURE_KEY, initialUiState } from './ui.state';

export const uiFeature = createFeature({
  name: UI_FEATURE_KEY,
  reducer: createReducer(
    initialUiState,
    on(UiActions.restoreLanguage, UiActions.setLanguage, (state, { language }) => ({
      ...state,
      language,
    })),
    on(UiActions.toggleMobileMenu, (state) => ({
      ...state,
      mobileMenuOpen: !state.mobileMenuOpen,
    })),
    on(UiActions.closeMobileMenu, (state) => ({ ...state, mobileMenuOpen: false })),
    on(UiActions.connectionChanged, (state, { online }) => ({ ...state, online })),
  ),
});
