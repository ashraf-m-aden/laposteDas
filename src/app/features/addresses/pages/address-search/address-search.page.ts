import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import type { AddressSuggestion } from '../../../../core/models';
import { AddressAutocompleteComponent } from '../../components/address-autocomplete/address-autocomplete.component';
import { AddressFacade } from '../../store/address.facade';

/** 6.7 Recherche d'adresse (fonctionnalité autonome, lecture seule). */
@Component({
  selector: 'app-address-search',
  imports: [PageHeaderComponent, AddressAutocompleteComponent, StatusLabelPipe, StatusTonePipe],
  templateUrl: './address-search.page.html',
  styleUrl: './address-search.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressSearchPage {
  protected readonly facade = inject(AddressFacade);
  private readonly toast = inject(ToastFacade);

  onSelected(suggestion: AddressSuggestion): void {
    this.facade.selectSuggestion(suggestion.id);
  }

  async copy(): Promise<void> {
    const address = this.facade.selected();
    if (!address) {
      return;
    }
    try {
      await navigator.clipboard.writeText(address.formatted);
      this.toast.success('Adresse normalisée copiée.');
    } catch {
      this.toast.warning('Copie impossible sur ce navigateur.');
    }
  }
}
