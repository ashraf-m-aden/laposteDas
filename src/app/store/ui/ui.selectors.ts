import { createSelector } from '@ngrx/store';
import { uiFeature } from './ui.reducer';

export const selectLanguage = uiFeature.selectLanguage;
export const selectMobileMenuOpen = uiFeature.selectMobileMenuOpen;
export const selectOnline = uiFeature.selectOnline;

export const selectIsEnglish = createSelector(selectLanguage, (language) => language === 'en');
