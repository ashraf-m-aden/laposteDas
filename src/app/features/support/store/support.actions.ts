import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { ApiError, FaqArticle, Ticket, TicketPayload } from '../../../core/models';

export const SupportActions = createActionGroup({
  source: 'Support',
  events: {
    'Load Faq': emptyProps(),
    'Load Faq Success': props<{ articles: FaqArticle[] }>(),
    'Load Faq Failure': props<{ error: ApiError }>(),
    'Set Faq Query': props<{ query: string }>(),
    'Set Faq Category': props<{ category: string }>(),
    'Load Tickets': emptyProps(),
    'Load Tickets Success': props<{ tickets: Ticket[] }>(),
    'Load Tickets Failure': props<{ error: ApiError }>(),
    'Select Ticket': props<{ id: string | null }>(),
    'Create Ticket': props<{ payload: TicketPayload }>(),
    'Create Ticket Success': props<{ ticket: Ticket }>(),
    'Create Ticket Failure': props<{ error: ApiError }>(),
    'Reply Ticket': props<{ id: string; body: string }>(),
    'Reply Ticket Success': props<{ ticket: Ticket }>(),
    'Reply Ticket Failure': props<{ error: ApiError }>(),
  },
});
