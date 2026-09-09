import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { TicketPayload } from '../../../core/models';
import { SupportActions } from './support.actions';
import {
  selectFaqCategories,
  selectFaqCategory,
  selectFaqDisplayStatus,
  selectFaqQuery,
  selectOpenTicketsCount,
  selectSelectedTicket,
  selectSending,
  selectSupportError,
  selectTickets,
  selectTicketsStatus,
  selectVisibleFaq,
} from './support.selectors';

@Injectable({ providedIn: 'root' })
export class SupportFacade {
  private readonly store = inject(Store);

  readonly faq = toSignal(this.store.select(selectVisibleFaq), { initialValue: [] });
  readonly faqStatus = toSignal(this.store.select(selectFaqDisplayStatus), {
    initialValue: 'idle' as const,
  });
  readonly faqCategories = toSignal(this.store.select(selectFaqCategories), { initialValue: [] });
  readonly faqCategory = toSignal(this.store.select(selectFaqCategory), { initialValue: 'ALL' });
  readonly faqQuery = toSignal(this.store.select(selectFaqQuery), { initialValue: '' });
  readonly tickets = toSignal(this.store.select(selectTickets), { initialValue: [] });
  readonly ticketsStatus = toSignal(this.store.select(selectTicketsStatus), {
    initialValue: 'idle' as const,
  });
  readonly selectedTicket = toSignal(this.store.select(selectSelectedTicket), {
    initialValue: null,
  });
  readonly openTicketsCount = toSignal(this.store.select(selectOpenTicketsCount), {
    initialValue: 0,
  });
  readonly sending = toSignal(this.store.select(selectSending), { initialValue: false });
  readonly error = toSignal(this.store.select(selectSupportError), { initialValue: null });

  loadFaq(): void {
    this.store.dispatch(SupportActions.loadFaq());
  }

  setFaqQuery(query: string): void {
    this.store.dispatch(SupportActions.setFaqQuery({ query }));
  }

  setFaqCategory(category: string): void {
    this.store.dispatch(SupportActions.setFaqCategory({ category }));
  }

  loadTickets(): void {
    this.store.dispatch(SupportActions.loadTickets());
  }

  selectTicket(id: string | null): void {
    this.store.dispatch(SupportActions.selectTicket({ id }));
  }

  createTicket(payload: TicketPayload): void {
    this.store.dispatch(SupportActions.createTicket({ payload }));
  }

  replyTicket(id: string, body: string): void {
    this.store.dispatch(SupportActions.replyTicket({ id, body }));
  }
}
