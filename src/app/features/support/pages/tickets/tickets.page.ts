import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { SupportFacade } from '../../store/support.facade';

/** 6.19 Notifications et support - Contact et suivi des demandes. */
@Component({
  selector: 'app-tickets',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    PageHeaderComponent,
    StatePanelComponent,
    StatusLabelPipe,
    StatusTonePipe,
  ],
  templateUrl: './tickets.page.html',
  styleUrl: './tickets.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly facade = inject(SupportFacade);
  protected readonly reply = signal('');

  readonly categories = ['Livraison', 'Facturation', 'Compte', 'Affranchissement', 'Autre'];

  readonly form = this.fb.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(4)]],
    category: ['Livraison', Validators.required],
    body: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.facade.loadTickets();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.createTicket(this.form.getRawValue());
    this.form.reset({ subject: '', category: 'Livraison', body: '' });
  }

  sendReply(): void {
    const ticket = this.facade.selectedTicket();
    const body = this.reply().trim();
    if (!ticket || body.length < 2) {
      return;
    }
    this.facade.replyTicket(ticket.id, body);
    this.reply.set('');
  }
}
