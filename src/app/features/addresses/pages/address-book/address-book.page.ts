import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import type { AddressBookEntry, AddressSuggestion } from '../../../../core/models';
import { AddressAutocompleteComponent } from '../../components/address-autocomplete/address-autocomplete.component';
import { AddressFacade } from '../../store/address.facade';

/** 6.23 Mon compte - Carnet d'adresses. */
@Component({
  selector: 'app-address-book',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    StatePanelComponent,
    AddressAutocompleteComponent,
  ],
  templateUrl: './address-book.page.html',
  styleUrl: './address-book.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressBookPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastFacade);
  protected readonly facade = inject(AddressFacade);

  /** Adresse validée retenue pour l'entrée en cours de saisie. */
  protected readonly pickedAddress = signal<{ id: string; label: string } | null>(null);
  protected readonly editingId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    contactName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{6,20}$/)]],
    kind: ['HOME' as AddressBookEntry['kind'], Validators.required],
    isDefault: [false],
  });

  ngOnInit(): void {
    this.facade.loadBook();
  }

  onAddressPicked(suggestion: AddressSuggestion): void {
    this.pickedAddress.set({ id: suggestion.id, label: suggestion.label });
  }

  clearAddress(): void {
    this.pickedAddress.set(null);
  }

  edit(entry: AddressBookEntry): void {
    this.editingId.set(entry.id);
    this.pickedAddress.set({ id: entry.address.id, label: entry.address.formatted });
    this.form.patchValue({
      contactName: entry.contactName,
      phone: entry.phone,
      kind: entry.kind,
      isDefault: entry.isDefault,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.pickedAddress.set(null);
    this.form.reset({ contactName: '', phone: '', kind: 'HOME', isDefault: false });
  }

  submit(): void {
    const address = this.pickedAddress();
    if (!address) {
      this.toast.warning("Sélectionnez d'abord une adresse validée.", 'Adresse manquante');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.getRawValue(), addressId: address.id };
    const editing = this.editingId();
    if (editing) {
      this.facade.updateEntry(editing, payload);
    } else {
      this.facade.addEntry(payload);
    }
    this.cancelEdit();
  }

  remove(entry: AddressBookEntry): void {
    this.facade.removeEntry(entry.id);
    if (this.editingId() === entry.id) {
      this.cancelEdit();
    }
  }
}
