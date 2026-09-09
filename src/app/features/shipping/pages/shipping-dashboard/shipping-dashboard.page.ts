import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import type { ShipmentStatus } from '../../../../core/models';
import { ShippingFacade } from '../../store/shipping.facade';

/** 6.15 Comptes entreprises - Tableau de bord des expéditions. */
@Component({
  selector: 'app-shipping-dashboard',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatePanelComponent,
    DjfPipe,
    StatusLabelPipe,
    StatusTonePipe,
  ],
  templateUrl: './shipping-dashboard.page.html',
  styleUrl: './shipping-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingDashboardPage implements OnInit {
  protected readonly facade = inject(ShippingFacade);
  private readonly toast = inject(ToastFacade);

  protected readonly statusFilter = signal<ShipmentStatus | ''>('');
  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const status = this.statusFilter();
    const needle = this.search().trim().toLowerCase();
    return this.facade.shipments().filter((shipment) => {
      const matchesStatus = !status || shipment.status === status;
      const matchesSearch =
        !needle ||
        `${shipment.trackingNumber} ${shipment.recipient.fullName} ${shipment.recipient.address.city}`
          .toLowerCase()
          .includes(needle);
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.facade.loadShipments();
  }

  /** Export CSV local : le back-end fournira un export serveur en production. */
  exportCsv(): void {
    const rows = [
      ['Numéro', 'Destinataire', 'Ville', 'Prestation', 'Statut', 'Montant', 'Créée le'],
      ...this.filtered().map((shipment) => [
        shipment.trackingNumber,
        shipment.recipient.fullName,
        shipment.recipient.address.city,
        shipment.serviceLabel,
        shipment.status,
        String(shipment.price),
        shipment.createdAt,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expeditions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.toast.success('Export CSV généré.');
  }
}
