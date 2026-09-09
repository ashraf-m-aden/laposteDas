import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import type { HistoryItemType } from '../../../../core/models';

/** 6.22 Mon compte - Historique des envois et achats. */
@Component({
  selector: 'app-history',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatePanelComponent,
    DjfPipe,
  ],
  templateUrl: './history.page.html',
  styleUrl: './history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPage implements OnInit {
  protected readonly auth = inject(AuthFacade);
  protected readonly typeFilter = signal<HistoryItemType | ''>('');

  protected readonly items = computed(() => {
    const type = this.typeFilter();
    return this.auth.history().filter((item) => !type || item.type === type);
  });

  ngOnInit(): void {
    this.auth.loadHistory();
  }

  isShipment(reference: string): boolean {
    return /^LP\d{9}DJ$/i.test(reference);
  }
}
