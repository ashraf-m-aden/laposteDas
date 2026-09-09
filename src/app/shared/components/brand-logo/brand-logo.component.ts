import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logo officiel de La Poste de Djibouti.
 *
 * Le fichier source est un JPEG sur fond blanc : il est détouré au build
 * (masque circulaire, `public/brand/`) pour poser correctement sur le bandeau
 * jaune de l'en-tête comme sur le pied de page marine.
 */
@Component({
  selector: 'app-brand-logo',
  template: `
    <img
      class="logo"
      src="brand/logo-laposte-256.png"
      [width]="size()"
      [height]="size()"
      [alt]="alt()"
      decoding="async"
      fetchpriority="high"
    />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex: 0 0 auto;
      }
      .logo {
        display: block;
        object-fit: contain;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  readonly size = input(44);
  /** Vide par défaut : dans l'en-tête, le nom est déjà écrit à côté du logo. */
  readonly alt = input('');
}
