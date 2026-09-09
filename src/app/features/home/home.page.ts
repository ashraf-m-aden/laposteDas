import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ToastFacade } from '../../store/toast/toast.facade';

/** 6.1 Accueil / Landing - page vitrine publique (visiteur inclus). */
@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastFacade);
  protected readonly auth = inject(AuthFacade);

  readonly quickTrack = this.fb.nonNullable.group({
    trackingNumber: ['', [Validators.required, Validators.pattern(/^LP\d{9}DJ$/i)]],
  });

  /** Accès rapides mis en avant sous le héros. */
  readonly quickAccess = [
    {
      icon: '📦',
      title: 'Suivre un colis',
      action: 'Suivre maintenant',
      link: '/suivi',
    },
    {
      icon: '🚚',
      title: 'Envoyer / réserver',
      action: 'Réserver un enlèvement',
      link: '/envoi',
    },
    {
      icon: '🏷️',
      title: 'Acheter un affranchissement',
      action: 'Voir le catalogue',
      link: '/affranchissement',
    },
    {
      icon: '🏢',
      title: 'Trouver une agence',
      action: 'Localiser un point',
      link: '/agences',
    },
  ];

  /** Services populaires (vitrine). */
  readonly popularServices = [
    { icon: '🚚', label: 'Livraison nationale', link: '/envoi' },
    { icon: '🌍', label: 'Envoi international', link: '/envoi' },
    { icon: '📮', label: 'Boîtes postales', link: '/agences' },
    { icon: '💱', label: "Transfert d'argent", link: '/agences' },
    { icon: '🖼️', label: 'Timbres et philatélie', link: '/affranchissement' },
    { icon: '🗺️', label: "Validation d'adresse", link: '/adresses' },
  ];

  readonly trustPoints = [
    {
      icon: '🛡️',
      title: 'Opérateur national de confiance',
      text: 'Le réseau postal officiel de la République de Djibouti.',
    },
    {
      icon: '🔒',
      title: 'Sûr et fiable',
      text: 'Envois tracés de bout en bout et remise contre signature.',
    },
    {
      icon: '⭐',
      title: 'Moderne et centré client',
      text: 'Services en libre-service, en ligne comme en agence.',
    },
    {
      icon: '📍',
      title: 'Adresses validées',
      text: 'Chaque adresse est normalisée par le référentiel postal.',
    },
  ];

  track(): void {
    if (this.quickTrack.invalid) {
      this.quickTrack.markAllAsTouched();
      this.toast.warning('Format attendu : LP123456789DJ.');
      return;
    }
    const value = this.quickTrack.getRawValue().trackingNumber.trim().toUpperCase();
    this.router.navigate(['/suivi', value]);
  }
}
