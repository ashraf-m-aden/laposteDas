import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ViewStatus } from '../../../core/models';

/**
 * États systématiques par écran (section 8) : chargement, vide, erreur.
 * Le contenu nominal est projeté par le parent quand `status` vaut `loaded`.
 */
@Component({
  selector: 'app-state-panel',
  templateUrl: './state-panel.component.html',
  styleUrl: './state-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatePanelComponent {
  readonly status = input.required<ViewStatus>();
  readonly loadingLabel = input('Chargement en cours…');
  readonly emptyLabel = input('Aucun résultat à afficher.');
  readonly errorLabel = input('Une erreur est survenue.');
  readonly retryLabel = input('Réessayer');
  readonly showRetry = input(true);

  readonly retry = output<void>();
}
