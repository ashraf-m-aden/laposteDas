import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NotificationActions } from './notification.actions';
import type { NotificationFilter } from './notification.state';
import {
  selectDisplayStatus,
  selectNotificationError,
  selectNotificationFilter,
  selectUnreadCount,
  selectVisibleNotifications,
} from './notification.selectors';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly store = inject(Store);

  readonly notifications = toSignal(this.store.select(selectVisibleNotifications), {
    initialValue: [],
  });
  readonly status = toSignal(this.store.select(selectDisplayStatus), {
    initialValue: 'idle' as const,
  });
  readonly filter = toSignal(this.store.select(selectNotificationFilter), {
    initialValue: 'ALL' as const,
  });
  readonly unreadCount = toSignal(this.store.select(selectUnreadCount), { initialValue: 0 });
  readonly error = toSignal(this.store.select(selectNotificationError), { initialValue: null });

  readonly unreadCount$ = this.store.select(selectUnreadCount);

  load(): void {
    this.store.dispatch(NotificationActions.load());
  }

  setFilter(filter: NotificationFilter): void {
    this.store.dispatch(NotificationActions.setFilter({ filter }));
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationActions.markAllAsRead());
  }
}
