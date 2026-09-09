import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationApi } from '../api.contracts';
import { API } from '../api.endpoints';
import type { AppNotification } from '../../models';

@Injectable()
export class NotificationHttpApi extends NotificationApi {
  private readonly http = inject(HttpClient);

  list(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(API.notification.list);
  }

  markAsRead(id: string): Observable<AppNotification> {
    return this.http.put<AppNotification>(API.notification.read(id), {});
  }

  markAllAsRead(): Observable<AppNotification[]> {
    return this.http.put<AppNotification[]>(API.notification.readAll, {});
  }
}
