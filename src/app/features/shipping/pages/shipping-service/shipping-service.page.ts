import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import { ShippingStepperComponent } from '../../components/shipping-stepper/shipping-stepper.component';
import { ShippingFacade } from '../../store/shipping.facade';

/** 6.5 Envoi / Réservation - Choix du service. */
@Component({
  selector: 'app-shipping-service',
  imports: [PageHeaderComponent, StatePanelComponent, ShippingStepperComponent, DjfPipe],
  templateUrl: './shipping-service.page.html',
  styleUrl: './shipping-service.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingServicePage implements OnInit {
  protected readonly facade = inject(ShippingFacade);
  private readonly toast = inject(ToastFacade);

  ngOnInit(): void {
    if (!this.facade.canGoToService()) {
      this.facade.goToStep(1);
      return;
    }
    if (this.facade.offersStatus() === 'idle') {
      this.facade.loadOffers();
    }
  }

  continue(): void {
    if (!this.facade.selectedOffer()) {
      this.toast.warning('Sélectionnez une prestation pour continuer.');
      return;
    }
    this.facade.goToStep(3);
  }
}
