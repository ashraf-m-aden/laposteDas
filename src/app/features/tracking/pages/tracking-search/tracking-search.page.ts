import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import { TrackingFacade } from '../../store/tracking.facade';

/** 6.2 Suivi de colis - Recherche. */
@Component({
  selector: 'app-tracking-search',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    PageHeaderComponent,
    StatusLabelPipe,
    StatusTonePipe,
  ],
  templateUrl: './tracking-search.page.html',
  styleUrl: './tracking-search.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingSearchPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastFacade);
  protected readonly facade = inject(TrackingFacade);

  /** Format attendu : LP + 9 chiffres + DJ (validation côté client, 6.2). */
  readonly form = this.fb.nonNullable.group({
    trackingNumber: ['', [Validators.required, Validators.pattern(/^LP\d{9}DJ$/i)]],
  });

  ngOnInit(): void {
    this.facade.restoreRecent();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Le numéro doit ressembler à LP123456789DJ.', 'Format invalide');
      return;
    }
    const trackingNumber = this.form.getRawValue().trackingNumber.trim().toUpperCase();
    this.router.navigate(['/suivi', trackingNumber]);
  }

  clearRecent(): void {
    this.facade.clearRecent();
    this.toast.info('Historique de suivi effacé.');
  }
}
