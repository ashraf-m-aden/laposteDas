import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupportApi } from '../api.contracts';
import type { FaqArticle, Ticket, TicketPayload } from '../../models';
import { MOCK_FAQ, MOCK_TICKETS } from '../../mock/mock-account';
import { clone, mockError, mockResponse, uid } from '../../mock/mock.util';

@Injectable()
export class SupportMockApi extends SupportApi {
  private db: Ticket[] = clone(MOCK_TICKETS);

  faq(): Observable<FaqArticle[]> {
    return mockResponse(clone(MOCK_FAQ));
  }

  tickets(): Observable<Ticket[]> {
    return mockResponse(clone(this.db));
  }

  createTicket(payload: TicketPayload): Observable<Ticket> {
    const ticket: Ticket = {
      id: uid('TCK'),
      reference: `SC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
      subject: payload.subject,
      category: payload.category,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: uid('MSG'),
          author: 'CLIENT',
          body: payload.body,
          sentAt: new Date().toISOString(),
        },
      ],
    };
    this.db = [ticket, ...this.db];
    return mockResponse(clone(ticket));
  }

  replyTicket(id: string, body: string): Observable<Ticket> {
    const ticket = this.db.find((item) => item.id === id);
    if (!ticket) {
      return mockError('TICKET_NOT_FOUND', 'Demande introuvable.', undefined, 404);
    }
    ticket.messages = [
      ...ticket.messages,
      { id: uid('MSG'), author: 'CLIENT', body, sentAt: new Date().toISOString() },
    ];
    ticket.status = 'PENDING';
    return mockResponse(clone(ticket));
  }
}
