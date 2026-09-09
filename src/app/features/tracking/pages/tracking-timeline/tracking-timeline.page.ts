import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import { TrackingFacade } from '../../store/tracking.facade';

/** 6.3 Suivi de colis - Timeline. */
@Component({
  selector: 'app-tracking-timeline',
  imports: [DatePipe, RouterLink, StatePanelComponent, StatusLabelPipe, StatusTonePipe],
  templateUrl: './tracking-timeline.page.html',
  styleUrl: './tracking-timeline.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingTimelinePage implements OnInit {
  /** Alimenté par `withComponentInputBinding()` depuis le paramètre de route. */
  readonly trackingNumber = input.required<string>();

  private readonly toast = inject(ToastFacade);
  protected readonly facade = inject(TrackingFacade);

  ngOnInit(): void {
    this.facade.track(this.trackingNumber());
  }

  retry(): void {
    this.facade.track(this.trackingNumber());
  }

  toggleNotifications(): void {
    const parcel = this.facade.parcel();
    if (parcel) {
      this.facade.toggleNotifications(parcel.trackingNumber, !parcel.notificationsEnabled);
    }
  }

  async share(): Promise<void> {
    const url = `${location.origin}/suivi/${this.trackingNumber()}`;
    try {
      await navigator.clipboard.writeText(url);
      this.toast.success('Lien de suivi copié dans le presse-papiers.');
    } catch {
      this.toast.warning('Copie impossible : copiez le lien depuis la barre d’adresse.');
    }
  }
}
