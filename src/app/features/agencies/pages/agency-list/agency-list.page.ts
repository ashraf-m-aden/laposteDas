import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DasMapComponent, type MapPoint } from '../../../../shared/components/das-map/das-map.component';
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

/** 6.11 Carte et 6.12 Liste filtrable : deux vues, un seul état NgRx. */
@Component({
  selector: 'app-agency-list',
  imports: [FormsModule, RouterLink, PageHeaderComponent, StatePanelComponent, DasMapComponent],
  templateUrl: './agency-list.page.html',
  styleUrl: './agency-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencyListPage implements OnInit {
  protected readonly facade = inject(AgencyFacade);

  readonly serviceLabels = SERVICE_LABELS;
  readonly serviceCodes = Object.keys(SERVICE_LABELS) as AgencyServiceCode[];

  /** Points transmis au fond de carte D.A.S. */
  readonly points = computed<MapPoint[]>(() =>
    this.facade.agencies().map((agency) => ({
      id: agency.id,
      longitude: agency.address.longitude,
      latitude: agency.address.latitude,
      label: agency.name,
      sublabel: agency.address.formatted,
      active: this.facade.selected()?.id === agency.id,
    })),
  );

  ngOnInit(): void {
    this.facade.load();
  }

  onQuery(value: string): void {
    this.facade.updateFilters({ query: value });
  }

  onService(value: string): void {
    this.facade.updateFilters({ service: (value || null) as AgencyServiceCode | null });
  }

  onOpenOnly(value: boolean): void {
    this.facade.updateFilters({ openOnly: value });
  }

  onSort(value: string): void {
    this.facade.updateFilters({ sortBy: value as 'distance' | 'name' });
  }

  select(id: string): void {
    this.facade.select(id);
  }
}
