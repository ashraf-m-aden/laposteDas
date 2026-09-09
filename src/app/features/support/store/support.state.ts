import type { ApiError, FaqArticle, Ticket, ViewStatus } from '../../../core/models';

export const SUPPORT_FEATURE_KEY = 'support';

export interface SupportState {
  faq: FaqArticle[];
  faqStatus: ViewStatus;
  faqQuery: string;
  faqCategory: string;
  tickets: Ticket[];
  ticketsStatus: ViewStatus;
  selectedTicketId: string | null;
  sending: boolean;
  error: ApiError | null;
}

export const initialSupportState: SupportState = {
  faq: [],
  faqStatus: 'idle',
  faqQuery: '',
  faqCategory: 'ALL',
  tickets: [],
  ticketsStatus: 'idle',
  selectedTicketId: null,
  sending: false,
  error: null,
};
