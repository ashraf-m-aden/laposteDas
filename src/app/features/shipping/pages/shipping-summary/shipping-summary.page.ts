import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { ShippingStepperComponent } from '../../components/shipping-stepper/shipping-stepper.component';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { ShippingFacade } from '../../store/shipping.facade';

/** 6.6 Envoi / Réservation - Récapitulatif et confirmation. */
@Component({
  selector: 'app-shipping-summary',
  imports: [DatePipe, RouterLink, PageHeaderComponent, ShippingStepperComponent, DjfPipe],
  templateUrl: './shipping-summary.page.html',
  styleUrl: './shipping-summary.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingSummaryPage implements OnInit {
  protected readonly facade = inject(ShippingFacade);
  protected readonly auth = inject(AuthFacade);

  ngOnInit(): void {
    if (!this.facade.canConfirm() && !this.facade.created()) {
      this.facade.goToStep(1);
    }
  }

  confirm(): void {
    this.facade.createShipment();
  }

  newShipment(): void {
    this.facade.resetDraft();
    this.facade.goToStep(1);
  }
}
