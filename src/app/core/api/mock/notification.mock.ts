import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationApi } from '../api.contracts';
import type { AppNotification } from '../../models';
import { MOCK_NOTIFICATIONS } from '../../mock/mock-account';
import { clone, mockError, mockResponse } from '../../mock/mock.util';

@Injectable()
export class NotificationMockApi extends NotificationApi {
  private notifications: AppNotification[] = clone(MOCK_NOTIFICATIONS);

  list(): Observable<AppNotification[]> {
    return mockResponse(clone(this.notifications));
  }

  markAsRead(id: string): Observable<AppNotification> {
    const notification = this.notifications.find((item) => item.id === id);
    if (!notification) {
      return mockError('NOTIFICATION_NOT_FOUND', 'Notification introuvable.', undefined, 404);
    }
    notification.read = true;
    return mockResponse(clone(notification));
  }

  markAllAsRead(): Observable<AppNotification[]> {
    this.notifications = this.notifications.map((item) => ({ ...item, read: true }));
    return mockResponse(clone(this.notifications));
  }
}
