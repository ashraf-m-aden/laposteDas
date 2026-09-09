import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { ShippingFacade } from '../../store/shipping.facade';

/** 6.16 Comptes entreprises - Tarifs négociés et simulateur. */
@Component({
  selector: 'app-business-rates',
  imports: [FormsModule, PageHeaderComponent, StatePanelComponent, DjfPipe],
  templateUrl: './business-rates.page.html',
  styleUrl: './business-rates.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessRatesPage implements OnInit {
  protected readonly facade = inject(ShippingFacade);

  protected readonly simWeight = signal(1);
  protected readonly simZone = signal('Djibouti-Ville');
  protected readonly simService = signal('STD');

  protected readonly zones = computed(() => [
    ...new Set(this.facade.ratesByService().flatMap((group) => group.rows.map((row) => row.zone))),
  ]);

  /** Palier applicable : première tranche dont le poids couvre la simulation. */
  protected readonly simulation = computed(() => {
    const rows = this.facade
      .ratesByService()
      .find((group) => group.code === this.simService())
      ?.rows.filter((row) => row.zone === this.simZone())
      .sort((a, b) => a.weightUpToKg - b.weightUpToKg);
    if (!rows?.length) {
      return null;
    }
    return rows.find((row) => this.simWeight() <= row.weightUpToKg) ?? rows[rows.length - 1];
  });

  ngOnInit(): void {
    this.facade.loadRates();
  }
}
