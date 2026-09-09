import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UiFacade } from '../../store/ui/ui.facade';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';
import type { Language } from '../../core/models';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, BrandLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly ui = inject(UiFacade);
  protected readonly auth = inject(AuthFacade);

  /** Navigation vitrine : services publics d'abord, compte à droite. */
  readonly links = [
    { path: '/', key: 'nav.home', exact: true },
    { path: '/suivi', key: 'nav.tracking', exact: false },
    { path: '/envoi', key: 'nav.shipping', exact: false },
    { path: '/affranchissement', key: 'nav.postage', exact: false },
    { path: '/agences', key: 'nav.agencies', exact: false },
    { path: '/aide', key: 'nav.support', exact: false },
  ];

  switchLanguage(language: Language): void {
    this.ui.setLanguage(language);
  }

  logout(): void {
    this.ui.closeMobileMenu();
    this.auth.logout();
  }
}
