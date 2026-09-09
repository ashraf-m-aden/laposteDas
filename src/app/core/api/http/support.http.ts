import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupportApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type { FaqArticle, Ticket, TicketPayload } from '../../models';

@Injectable()
export class SupportHttpApi extends SupportApi {
  private readonly http = inject(HttpClient);

  faq(): Observable<FaqArticle[]> {
    return this.http.get<FaqArticle[]>(API.support.faq);
  }

  tickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(API.support.tickets);
  }

  createTicket(payload: TicketPayload): Observable<Ticket> {
    return this.http.post<Ticket>(API.support.tickets, payload);
  }

  replyTicket(id: string, body: string): Observable<Ticket> {
    return this.http.post<Ticket>(API.support.ticketReply(id), { body });
  }
}
