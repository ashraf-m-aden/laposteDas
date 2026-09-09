export type TicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED';

export interface TicketMessage {
  id: string;
  author: 'CLIENT' | 'AGENT';
  body: string;
  sentAt: string;
}

/** Demande d'assistance (6.19). */
export interface Ticket {
  id: string;
  reference: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export interface TicketPayload {
  subject: string;
  category: string;
  body: string;
}

/** Article de FAQ (6.18). */
export interface FaqArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
}
