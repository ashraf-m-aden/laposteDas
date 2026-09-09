import { createSelector } from '@ngrx/store';
import { addressFeature } from './address.reducer';

export const selectQuery = addressFeature.selectQuery;
export const selectSuggestions = addressFeature.selectSuggestions;
export const selectSearchStatus = addressFeature.selectSearchStatus;
export const selectSelectedAddress = addressFeature.selectSelected;
export const selectDetailStatus = addressFeature.selectDetailStatus;
export const selectAddressBook = addressFeature.selectBook;
export const selectBookStatus = addressFeature.selectBookStatus;
export const selectSaving = addressFeature.selectSaving;
export const selectAddressError = addressFeature.selectError;

export const selectHasSuggestions = createSelector(
  selectSuggestions,
  (suggestions) => suggestions.length > 0,
);

/** Une adresse validée est la seule utilisable dans un parcours transactionnel (section 8). */
export const selectIsSelectionUsable = createSelector(
  selectSelectedAddress,
  (address) => address?.status === 'VALIDATED',
);

export const selectDefaultEntry = createSelector(
  selectAddressBook,
  (book) => book.find((entry) => entry.isDefault) ?? null,
);

export const selectBookOptions = createSelector(selectAddressBook, (book) =>
  book.map((entry) => ({
    id: entry.id,
    label: `${entry.contactName} - ${entry.address.formatted}`,
    entry,
  })),
);
