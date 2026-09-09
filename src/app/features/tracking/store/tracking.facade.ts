import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TrackingActions } from './tracking.actions';
import { readRecent } from './tracking.effects';
import {
  selectCurrentStep,
  selectIsNotFound,
  selectIsTracking,
  selectNotFoundNumber,
  selectNotificationsEnabled,
  selectParcel,
  selectRecentTrackings,
  selectTimeline,
  selectTrackingError,
  selectTrackingStatus,
} from './tracking.selectors';

@Injectable({ providedIn: 'root' })
export class TrackingFacade {
  private readonly store = inject(Store);

  readonly parcel = toSignal(this.store.select(selectParcel), { initialValue: null });
  readonly status = toSignal(this.store.select(selectTrackingStatus), {
    initialValue: 'idle' as const,
  });
  readonly loading = toSignal(this.store.select(selectIsTracking), { initialValue: false });
  readonly error = toSignal(this.store.select(selectTrackingError), { initialValue: null });
  readonly notFoundNumber = toSignal(this.store.select(selectNotFoundNumber), {
    initialValue: null,
  });
  readonly isNotFound = toSignal(this.store.select(selectIsNotFound), { initialValue: false });
  readonly timeline = toSignal(this.store.select(selectTimeline), { initialValue: [] });
  readonly currentStep = toSignal(this.store.select(selectCurrentStep), { initialValue: 0 });
  readonly recent = toSignal(this.store.select(selectRecentTrackings), { initialValue: [] });
  readonly notificationsEnabled = toSignal(this.store.select(selectNotificationsEnabled), {
    initialValue: false,
  });

  track(trackingNumber: string): void {
    this.store.dispatch(TrackingActions.track({ trackingNumber }));
  }

  toggleNotifications(trackingNumber: string, enabled: boolean): void {
    this.store.dispatch(TrackingActions.toggleNotifications({ trackingNumber, enabled }));
  }

  restoreRecent(): void {
    this.store.dispatch(TrackingActions.restoreRecent({ recent: readRecent() }));
  }

  clearRecent(): void {
    this.store.dispatch(TrackingActions.clearRecent());
  }

  reset(): void {
    this.store.dispatch(TrackingActions.reset());
  }
}
