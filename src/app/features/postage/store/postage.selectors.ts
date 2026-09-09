import { createSelector } from '@ngrx/store';
import { postageFeature } from './postage.reducer';

export const selectProducts = postageFeature.selectProducts;
export const selectProductsStatus = postageFeature.selectProductsStatus;
export const selectCategory = postageFeature.selectCategory;
export const selectSelectedProductId = postageFeature.selectSelectedProductId;
export const selectQuote = postageFeature.selectQuote;
export const selectQuoteStatus = postageFeature.selectQuoteStatus;
export const selectPaying = postageFeature.selectPaying;
export const selectLabel = postageFeature.selectLabel;
export const selectPostageError = postageFeature.selectError;

export const selectFilteredProducts = createSelector(
  selectProducts,
  selectCategory,
  (products, category) =>
    category === 'ALL' ? products : products.filter((product) => product.category === category),
);

export const selectSelectedProduct = createSelector(
  selectProducts,
  selectSelectedProductId,
  (products, id) => products.find((product) => product.id === id) ?? null,
);

export const selectCanPay = createSelector(
  selectQuote,
  selectPaying,
  (quote, paying) => !!quote && !paying,
);

export const selectAvailableCount = createSelector(
  selectFilteredProducts,
  (products) => products.filter((product) => product.available).length,
);
