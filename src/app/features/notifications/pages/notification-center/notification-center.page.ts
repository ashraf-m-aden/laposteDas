import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import type { AppNotification } from '../../../../core/models';
import { NotificationFacade } from '../../store/notification.facade';
import type { NotificationFilter } from '../../store/notification.state';

/** 6.17 Notifications et support - Centre de notifications. */
@Component({
  selector: 'app-notification-center',
  imports: [DatePipe, RouterLink, PageHeaderComponent, StatePanelComponent],
  templateUrl: './notification-center.page.html',
  styleUrl: './notification-center.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterPage implements OnInit {
  protected readonly facade = inject(NotificationFacade);

  readonly filters: { code: NotificationFilter; label: string }[] = [
    { code: 'ALL', label: 'Toutes' },
    { code: 'UNREAD', label: 'Non lues' },
    { code: 'READ', label: 'Lues' },
  ];

  readonly typeIcons: Record<AppNotification['type'], string> = {
    TRACKING: '📦',
    PROMO: '🎁',
    SYSTEM: '⚙️',
  };

  ngOnInit(): void {
    this.facade.load();
  }
}
