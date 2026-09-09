import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AddressAutocompleteComponent } from '../../../addresses/components/address-autocomplete/address-autocomplete.component';
import { AddressFacade } from '../../../addresses/store/address.facade';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import type { AddressSuggestion, ParcelKind } from '../../../../core/models';
import { ShippingStepperComponent } from '../../components/shipping-stepper/shipping-stepper.component';
import { ShippingFacade } from '../../store/shipping.facade';
import type { PartyField } from '../../store/shipping.state';

/** 6.4 Envoi / Réservation - Formulaire expéditeur et destinataire. */
@Component({
  selector: 'app-shipping-parties',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    AddressAutocompleteComponent,
    ShippingStepperComponent,
  ],
  templateUrl: './shipping-parties.page.html',
  styleUrl: './shipping-parties.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingPartiesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastFacade);
  protected readonly facade = inject(ShippingFacade);
  protected readonly addresses = inject(AddressFacade);
  protected readonly auth = inject(AuthFacade);

  readonly form = this.fb.nonNullable.group({
    senderName: ['', Validators.required],
    senderPhone: ['', Validators.required],
    senderEmail: ['', Validators.email],
    recipientName: ['', Validators.required],
    recipientPhone: ['', Validators.required],
    kind: ['PARCEL' as ParcelKind, Validators.required],
    weightKg: [1, [Validators.required, Validators.min(0.1), Validators.max(30)]],
    lengthCm: [30, [Validators.required, Validators.min(1)]],
    widthCm: [20, [Validators.required, Validators.min(1)]],
    heightCm: [10, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    // Le carnet n'existe que pour un client connecté (parcours ouvert aux visiteurs).
    if (this.auth.isAuthenticated()) {
      this.addresses.loadBook();
    }
    const sender = this.facade.sender();
    const recipient = this.facade.recipient();
    const parcel = this.facade.parcel();
    this.form.patchValue({
      senderName: sender?.fullName ?? '',
      senderPhone: sender?.phone ?? '',
      senderEmail: sender?.email ?? '',
      recipientName: recipient?.fullName ?? '',
      recipientPhone: recipient?.phone ?? '',
      ...parcel,
    });
  }

  onSuggestion(field: PartyField, suggestion: AddressSuggestion): void {
    this.facade.resolveAddress(field, suggestion.id);
  }

  /** Sélection depuis le carnet : l'adresse est déjà normalisée et validée. */
  pickFromBook(field: PartyField, entryId: string): void {
    const entry = this.addresses.book().find((item) => item.id === entryId);
    if (!entry) {
      return;
    }
    this.facade.setAddress(field, entry.address);
    this.facade.setContact(field, { fullName: entry.contactName, phone: entry.phone });
    this.form.patchValue(
      field === 'sender'
        ? { senderName: entry.contactName, senderPhone: entry.phone }
        : { recipientName: entry.contactName, recipientPhone: entry.phone },
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Complétez les informations obligatoires.');
      return;
    }
    const value = this.form.getRawValue();
    this.facade.setContact('sender', {
      fullName: value.senderName,
      phone: value.senderPhone,
      email: value.senderEmail || undefined,
    });
    this.facade.setContact('recipient', {
      fullName: value.recipientName,
      phone: value.recipientPhone,
    });
    this.facade.setParcel({
      kind: value.kind,
      weightKg: value.weightKg,
      lengthCm: value.lengthCm,
      widthCm: value.widthCm,
      heightCm: value.heightCm,
    });

    if (!this.facade.senderComplete() || !this.facade.recipientComplete()) {
      this.toast.error(
        'Les deux adresses doivent être validées par le référentiel avant de continuer.',
        'Adresse requise',
      );
      return;
    }
    this.facade.loadOffers();
    this.facade.goToStep(2);
  }
}
