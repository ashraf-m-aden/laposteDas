import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  ApiError,
  PaymentMethod,
  PostageCategory,
  PostageLabel,
  PostageProduct,
  PostageQuote,
  PostageQuoteRequest,
} from '../../../core/models';

export const PostageActions = createActionGroup({
  source: 'Postage',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: PostageProduct[] }>(),
    'Load Products Failure': props<{ error: ApiError }>(),
    'Set Category': props<{ category: PostageCategory | 'ALL' }>(),
    'Select Product': props<{ id: string }>(),
    'Request Quote': props<{ request: PostageQuoteRequest }>(),
    'Quote Success': props<{ quote: PostageQuote }>(),
    'Quote Failure': props<{ error: ApiError }>(),
    Pay: props<{ method: PaymentMethod }>(),
    'Pay Success': props<{ label: PostageLabel }>(),
    'Pay Failure': props<{ error: ApiError }>(),
    Reset: emptyProps(),
  },
});
