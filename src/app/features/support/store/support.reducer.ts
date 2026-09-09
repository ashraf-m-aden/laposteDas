import { createFeature, createReducer, on } from '@ngrx/store';
import { SupportActions } from './support.actions';
import { SUPPORT_FEATURE_KEY, initialSupportState } from './support.state';

export const supportFeature = createFeature({
  name: SUPPORT_FEATURE_KEY,
  reducer: createReducer(
    initialSupportState,
    on(SupportActions.loadFaq, (state) => ({ ...state, faqStatus: 'loading' as const })),
    on(SupportActions.loadFaqSuccess, (state, { articles }) => ({
      ...state,
      faq: articles,
      faqStatus: articles.length ? ('loaded' as const) : ('empty' as const),
    })),
    on(SupportActions.loadFaqFailure, (state, { error }) => ({
      ...state,
      faqStatus: 'error' as const,
      error,
    })),
    on(SupportActions.setFaqQuery, (state, { query }) => ({ ...state, faqQuery: query })),
    on(SupportActions.setFaqCategory, (state, { category }) => ({
      ...state,
      faqCategory: category,
    })),
    on(SupportActions.loadTickets, (state) => ({ ...state, ticketsStatus: 'loading' as const })),
    on(SupportActions.loadTicketsSuccess, (state, { tickets }) => ({
      ...state,
      tickets,
      ticketsStatus: tickets.length ? ('loaded' as const) : ('empty' as const),
      selectedTicketId: state.selectedTicketId ?? tickets[0]?.id ?? null,
    })),
    on(SupportActions.loadTicketsFailure, (state, { error }) => ({
      ...state,
      ticketsStatus: 'error' as const,
      error,
    })),
    on(SupportActions.selectTicket, (state, { id }) => ({ ...state, selectedTicketId: id })),
    on(SupportActions.createTicket, SupportActions.replyTicket, (state) => ({
      ...state,
      sending: true,
      error: null,
    })),
    on(SupportActions.createTicketSuccess, (state, { ticket }) => ({
      ...state,
      sending: false,
      tickets: [ticket, ...state.tickets],
      ticketsStatus: 'loaded' as const,
      selectedTicketId: ticket.id,
    })),
    on(SupportActions.replyTicketSuccess, (state, { ticket }) => ({
      ...state,
      sending: false,
      tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)),
    })),
    on(
      SupportActions.createTicketFailure,
      SupportActions.replyTicketFailure,
      (state, { error }) => ({ ...state, sending: false, error }),
    ),
  ),
});
