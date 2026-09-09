import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { PaymentMethod, PostageCategory, PostageQuoteRequest } from '../../../core/models';
import { PostageActions } from './postage.actions';
import {
  selectAvailableCount,
  selectCanPay,
  selectCategory,
  selectFilteredProducts,
  selectLabel,
  selectPaying,
  selectPostageError,
  selectProductsStatus,
  selectQuote,
  selectQuoteStatus,
  selectSelectedProduct,
} from './postage.selectors';

@Injectable({ providedIn: 'root' })
export class PostageFacade {
  private readonly store = inject(Store);

  readonly products = toSignal(this.store.select(selectFilteredProducts), { initialValue: [] });
  readonly productsStatus = toSignal(this.store.select(selectProductsStatus), {
    initialValue: 'idle' as const,
  });
  readonly category = toSignal(this.store.select(selectCategory), { initialValue: 'ALL' as const });
  readonly selectedProduct = toSignal(this.store.select(selectSelectedProduct), {
    initialValue: null,
  });
  readonly quote = toSignal(this.store.select(selectQuote), { initialValue: null });
  readonly quoteStatus = toSignal(this.store.select(selectQuoteStatus), {
    initialValue: 'idle' as const,
  });
  readonly paying = toSignal(this.store.select(selectPaying), { initialValue: false });
  readonly canPay = toSignal(this.store.select(selectCanPay), { initialValue: false });
  readonly label = toSignal(this.store.select(selectLabel), { initialValue: null });
  readonly availableCount = toSignal(this.store.select(selectAvailableCount), { initialValue: 0 });
  readonly error = toSignal(this.store.select(selectPostageError), { initialValue: null });

  loadProducts(): void {
    this.store.dispatch(PostageActions.loadProducts());
  }

  setCategory(category: PostageCategory | 'ALL'): void {
    this.store.dispatch(PostageActions.setCategory({ category }));
  }

  selectProduct(id: string): void {
    this.store.dispatch(PostageActions.selectProduct({ id }));
  }

  requestQuote(request: PostageQuoteRequest): void {
    this.store.dispatch(PostageActions.requestQuote({ request }));
  }

  pay(method: PaymentMethod): void {
    this.store.dispatch(PostageActions.pay({ method }));
  }

  reset(): void {
    this.store.dispatch(PostageActions.reset());
  }
}
