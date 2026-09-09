import { createSelector } from '@ngrx/store';
import { supportFeature } from './support.reducer';

export const selectFaq = supportFeature.selectFaq;
export const selectFaqStatus = supportFeature.selectFaqStatus;
export const selectFaqQuery = supportFeature.selectFaqQuery;
export const selectFaqCategory = supportFeature.selectFaqCategory;
export const selectTickets = supportFeature.selectTickets;
export const selectTicketsStatus = supportFeature.selectTicketsStatus;
export const selectSelectedTicketId = supportFeature.selectSelectedTicketId;
export const selectSending = supportFeature.selectSending;
export const selectSupportError = supportFeature.selectError;

export const selectFaqCategories = createSelector(selectFaq, (articles) => [
  'ALL',
  ...new Set(articles.map((article) => article.category)),
]);

export const selectVisibleFaq = createSelector(
  selectFaq,
  selectFaqQuery,
  selectFaqCategory,
  (articles, query, category) => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = category === 'ALL' || article.category === category;
      const matchesQuery =
        !needle || `${article.question} ${article.answer}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  },
);

export const selectFaqDisplayStatus = createSelector(
  selectFaqStatus,
  selectVisibleFaq,
  (status, visible) => (status === 'loaded' && !visible.length ? ('empty' as const) : status),
);

export const selectSelectedTicket = createSelector(
  selectTickets,
  selectSelectedTicketId,
  (tickets, id) => tickets.find((ticket) => ticket.id === id) ?? null,
);

export const selectOpenTicketsCount = createSelector(
  selectTickets,
  (tickets) => tickets.filter((ticket) => ticket.status !== 'RESOLVED').length,
);
