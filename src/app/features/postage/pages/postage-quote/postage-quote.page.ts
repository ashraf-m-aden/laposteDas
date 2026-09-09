import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { AddressAutocompleteComponent } from '../../../addresses/components/address-autocomplete/address-autocomplete.component';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import type { AddressSuggestion, PaymentMethod } from '../../../../core/models';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { PostageFacade } from '../../store/postage.facade';

/** 6.9 Achat d'affranchissement - Calcul du tarif et paiement. */
@Component({
  selector: 'app-postage-quote',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    AddressAutocompleteComponent,
    DjfPipe,
  ],
  templateUrl: './postage-quote.page.html',
  styleUrl: './postage-quote.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostageQuotePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastFacade);
  protected readonly facade = inject(PostageFacade);
  protected readonly auth = inject(AuthFacade);

  protected readonly destination = signal<{ id: string; label: string } | null>(null);
  protected readonly paymentMethod = signal<PaymentMethod>('CARD');

  readonly form = this.fb.nonNullable.group({
    weightGrams: [20, [Validators.required, Validators.min(1), Validators.max(30000)]],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  ngOnInit(): void {
    if (!this.facade.selectedProduct()) {
      this.router.navigate(['/affranchissement']);
    }
  }

  onDestination(suggestion: AddressSuggestion): void {
    this.destination.set({ id: suggestion.id, label: suggestion.label });
  }

  compute(): void {
    const product = this.facade.selectedProduct();
    const destination = this.destination();
    if (!product) {
      return;
    }
    if (!destination) {
      this.toast.warning('Sélectionnez une destination validée pour calculer le tarif.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.requestQuote({
      productId: product.id,
      destinationAddressId: destination.id,
      ...this.form.getRawValue(),
    });
  }

  pay(): void {
    this.facade.pay(this.paymentMethod());
  }
}
