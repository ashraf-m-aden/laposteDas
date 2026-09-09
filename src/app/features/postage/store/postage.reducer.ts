import { createFeature, createReducer, on } from '@ngrx/store';
import { PostageActions } from './postage.actions';
import { POSTAGE_FEATURE_KEY, initialPostageState } from './postage.state';

export const postageFeature = createFeature({
  name: POSTAGE_FEATURE_KEY,
  reducer: createReducer(
    initialPostageState,
    on(PostageActions.loadProducts, (state) => ({
      ...state,
      productsStatus: 'loading' as const,
      error: null,
    })),
    on(PostageActions.loadProductsSuccess, (state, { products }) => ({
      ...state,
      products,
      productsStatus: products.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(PostageActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      productsStatus: 'error' as const,
      error,
    })),
    on(PostageActions.setCategory, (state, { category }) => ({ ...state, category })),
    on(PostageActions.selectProduct, (state, { id }) => ({
      ...state,
      selectedProductId: id,
      quote: null,
      quoteStatus: 'idle' as const,
      label: null,
    })),
    on(PostageActions.requestQuote, (state) => ({
      ...state,
      quoteStatus: 'loading' as const,
      error: null,
    })),
    on(PostageActions.quoteSuccess, (state, { quote }) => ({
      ...state,
      quote,
      quoteStatus: 'loaded' as const,
    })),
    on(PostageActions.quoteFailure, (state, { error }) => ({
      ...state,
      quote: null,
      quoteStatus: 'error' as const,
      error,
    })),
    on(PostageActions.pay, (state) => ({ ...state, paying: true, error: null })),
    on(PostageActions.paySuccess, (state, { label }) => ({ ...state, paying: false, label })),
    on(PostageActions.payFailure, (state, { error }) => ({ ...state, paying: false, error })),
    on(PostageActions.reset, (state) => ({
      ...initialPostageState,
      products: state.products,
      productsStatus: state.productsStatus,
    })),
  ),
});
