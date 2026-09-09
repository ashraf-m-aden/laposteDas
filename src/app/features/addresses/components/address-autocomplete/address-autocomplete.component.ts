import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { AddressFacade } from '../../store/address.facade';
import type { AddressSuggestion } from '../../../../core/models';

/**
 * Champ d'adresse avec autocomplétion servie par le back-end postal.
 * Le composant n'émet qu'une suggestion : la résolution en adresse normalisée
 * est faite par le store du parcours appelant (envoi, carnet, recherche).
 */
@Component({
  selector: 'app-address-autocomplete',
  imports: [],
  templateUrl: './address-autocomplete.component.html',
  styleUrl: './address-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressAutocompleteComponent {
  readonly label = input('Adresse');
  readonly fieldId = input.required<string>();
  readonly placeholder = input('Rue, quartier, ville…');
  readonly hint = input('Sélectionnez une suggestion : seules les adresses validées sont acceptées.');
  readonly resolvedLabel = input<string | null>(null);
  readonly invalid = input(false);

  readonly suggestionSelected = output<AddressSuggestion>();
  readonly cleared = output<void>();

  private readonly facade = inject(AddressFacade);
  /** Un seul champ actif à la fois : évite d'afficher les suggestions partout. */
  private readonly active = signal(false);
  protected readonly term = signal('');

  protected readonly suggestions = computed(() =>
    this.active() ? this.facade.suggestions() : [],
  );
  protected readonly searching = computed(
    () => this.active() && this.facade.searchStatus() === 'loading',
  );
  protected readonly noResult = computed(
    () => this.active() && this.facade.searchStatus() === 'empty' && this.term().length >= 2,
  );

  onInput(value: string): void {
    this.active.set(true);
    this.term.set(value);
    this.facade.search(value);
  }

  choose(suggestion: AddressSuggestion): void {
    this.active.set(false);
    this.term.set('');
    this.facade.clearSuggestions();
    this.suggestionSelected.emit(suggestion);
  }

  clear(): void {
    this.active.set(false);
    this.term.set('');
    this.facade.clearSuggestions();
    this.cleared.emit();
  }
}
