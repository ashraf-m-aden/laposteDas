import type {
  ApiError,
  PostageCategory,
  PostageLabel,
  PostageProduct,
  PostageQuote,
  ViewStatus,
} from '../../../core/models';

export const POSTAGE_FEATURE_KEY = 'postage';

export interface PostageState {
  products: PostageProduct[];
  productsStatus: ViewStatus;
  category: PostageCategory | 'ALL';
  selectedProductId: string | null;
  quote: PostageQuote | null;
  quoteStatus: ViewStatus;
  paying: boolean;
  label: PostageLabel | null;
  error: ApiError | null;
}

export const initialPostageState: PostageState = {
  products: [],
  productsStatus: 'idle',
  category: 'ALL',
  selectedProductId: null,
  quote: null,
  quoteStatus: 'idle',
  paying: false,
  label: null,
  error: null,
};
