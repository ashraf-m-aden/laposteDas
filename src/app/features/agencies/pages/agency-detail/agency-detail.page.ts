import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DasMapComponent, type MapPoint } from '../../../../shared/components/das-map/das-map.component';
import { environment } from '../../../../../environments/environment';
import type { AgencyServiceCode } from '../../../../core/models';
import { AgencyFacade } from '../../store/agency.facade';

const SERVICE_LABELS: Record<AgencyServiceCode, string> = {
  MAIL: 'Courrier',
  PARCEL: 'Colis',
  ATM: 'DAB',
  MONEY_TRANSFER: 'Transfert d’argent',
  PO_BOX: 'Boîte postale',
  PHILATELY: 'Philatélie',
};

const DAY_LABELS: Record<string, string> = {
  MON: 'Lundi',
  TUE: 'Mardi',
  WED: 'Mercredi',
  THU: 'Jeudi',
  FRI: 'Vendredi',
  SAT: 'Samedi',
  SUN: 'Dimanche',
};

/** 6.13 Agences et services - Détail agence. */
@Component({
  selector: 'app-agency-detail',
  imports: [RouterLink, StatePanelComponent, DasMapComponent],
  templateUrl: './agency-detail.page.html',
  styleUrl: './agency-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencyDetailPage implements OnInit {
  readonly id = input.required<string>();

  protected readonly facade = inject(AgencyFacade);
  readonly serviceLabels = SERVICE_LABELS;
  readonly dayLabels = DAY_LABELS;

  ngOnInit(): void {
    this.facade.loadDetail(this.id());
  }

  retry(): void {
    this.facade.loadDetail(this.id());
  }

  /** Point unique transmis à la mini-carte. */
  readonly point = computed<MapPoint[]>(() => {
    const agency = this.facade.selected();
    return agency
      ? [
          {
            id: agency.id,
            longitude: agency.address.longitude,
            latitude: agency.address.latitude,
            label: agency.name,
            sublabel: agency.address.formatted,
            active: true,
          },
        ]
      : [];
  });

  /**
   * Ouverture dans la carte vitrine D.A.S — le référentiel qui fait foi pour
   * les adresses de Djibouti, à la place d'un fond cartographique tiers.
   */
  openInDasViewer(latitude: number, longitude: number, label: string): void {
    const url = new URL(this.viewerBase());
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lng', String(longitude));
    url.searchParams.set('z', '17');
    url.searchParams.set('marker', `${longitude},${latitude}`);
    url.searchParams.set('label', label);
    window.open(url.toString(), '_blank', 'noopener');
  }

  /**
   * Racine de la carte vitrine D.A.S.
   *
   * ⚠️ **Deduite de l'origine courante quand `viewerUrl` est vide**, et c'est le
   * cas normal aujourd'hui : D.A.S et la Plateforme 1 partagent une machine,
   * D.A.S y repond sur le port 80 et nous sur 8080 — d'ou l'hote sans le port.
   *
   * Une adresse ecrite en dur serait fausse partout : `localhost` ne veut rien
   * dire pour un visiteur distant, et `carte.das.dj` NE RESOUT PAS — le domaine
   * n'est pas encore enregistre (verifie le 2026-09-13). Un lien mort ouvert
   * dans un nouvel onglet se decouvre par le visiteur, pas par nous.
   *
   * C'est le meme raisonnement que D.A.S applique a ses liens de remise de cle :
   * l'origine publique est connue du NAVIGATEUR, jamais du serveur.
   */
  private viewerBase(): string {
    const configuree = environment.map.viewerUrl;
    if (configuree) {
      return configuree;
    }
    return `${window.location.protocol}//${window.location.hostname}/carte`;
  }
}
