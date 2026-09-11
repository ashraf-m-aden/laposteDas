import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map as rxMap } from 'rxjs';
import type { Map as MapLibreMap, Marker, StyleSpecification } from 'maplibre-gl';
import { environment } from '../../../../environments/environment';

export interface MapPoint {
  id: string;
  longitude: number;
  latitude: number;
  label: string;
  sublabel?: string;
  active?: boolean;
}

/**
 * Carte des agences, adossée au fond de carte du référentiel D.A.S.
 *
 * Le style est publié par D.A.S et récupéré tel quel : la cartographie reste
 * la propriété du référentiel, la Plateforme 1 ne la recopie pas. Seul le
 * marqueur `__TILES_BASE_URL__` est résolu ici, avec l'URL du service de
 * tuiles de l'environnement — en production, celle du back-end postal qui
 * relaie D.A.S (chapitre 2 du cahier des charges : la Plateforme 1 ne
 * s'adresse jamais directement à D.A.S).
 *
 * MapLibre est chargé en import dynamique : ~200 Ko qui n'ont pas à peser sur
 * les écrans qui ne montrent pas de carte.
 */
@Component({
  selector: 'app-das-map',
  imports: [],
  templateUrl: './das-map.component.html',
  styleUrl: './das-map.component.scss',
  // MapLibre crée marqueurs, popups et contrôles hors du DOM encapsulé : avec
  // l'encapsulation par défaut, Angular ne leur pose pas l'attribut de scope et
  // aucune de ces règles ne s'applique (marqueur déformé, contrôles nus).
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DasMapComponent {
  readonly points = input<MapPoint[]>([]);
  readonly zoom = input(12);
  readonly center = input<[number, number]>([43.145, 11.588]);
  readonly interactive = input(true);
  readonly height = input('420px');

  readonly pointSelected = output<string>();

  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  private map: MapLibreMap | null = null;
  /**
   * Verrou d'initialisation. `init()` est asynchrone (import dynamique de
   * MapLibre) : entre son appel et l'affectation de `this.map`, l'effet peut
   * se rejouer — les points arrivent du store juste après le premier rendu.
   * Sans ce drapeau, DEUX cartes étaient construites sur le même conteneur :
   * le canvas de l'une, les épingles de l'autre, et l'écran restait sur
   * « Chargement du fond de carte ».
   */
  private initEnCours = false;
  private markers: Marker[] = [];
  private lib: typeof import('maplibre-gl') | null = null;

  constructor() {
    effect(() => {
      const host = this.host().nativeElement;
      const points = this.points(); // dépendance explicite de l'effet
      if (!this.initEnCours) {
        this.initEnCours = true;
        void this.init(host);
        return;
      }
      if (this.map && points) {
        this.drawPoints();
      }
    });
    this.destroyRef.onDestroy(() => this.map?.remove());
  }

  /**
   * Feuille de style MapLibre chargée à la demande, depuis les assets.
   * Ni dans `styles.scss` (83 Ko sur TOUTES les pages, y compris celles sans
   * carte), ni dans les styles du composant (le budget `anyComponentStyle`
   * refuse un fichier de cette taille, et à raison : il surveille NOS styles).
   */
  private static chargerCssMapLibre(): void {
    const id = 'maplibre-gl-css';
    if (document.getElementById(id)) {
      return;
    }
    const lien = document.createElement('link');
    lien.id = id;
    lien.rel = 'stylesheet';
    lien.href = 'maplibre-gl.css';
    document.head.appendChild(lien);
  }

  private async init(host: HTMLElement): Promise<void> {
    try {
      DasMapComponent.chargerCssMapLibre();
      this.lib = await import('maplibre-gl');
      // MapLibre v6 charge son worker de rendu depuis un fichier séparé, copié
      // à la racine par `assets` (angular.json). `maplibre-gl` est par ailleurs
      // exclu de la pré-optimisation du serveur de dev : prébundlée, la
      // librairie pointait son worker vers un chemin `deps/` que le serveur ne
      // servait jamais — la requête restait en attente, le style ne se chargeait
      // pas et l'écran restait sur « Chargement du fond de carte ».
      this.lib.setWorkerUrl(new URL('maplibre-gl-worker.mjs', document.baseURI).href);
      const style = await this.loadStyle();
      const carte = new this.lib.Map({
        container: host,
        style,
        center: this.center(),
        zoom: this.zoom(),
        attributionControl: false,
        interactive: this.interactive(),
        maxBounds: [
          [41.0, 10.4],
          [44.2, 13.3],
        ],
      });
      this.map = carte;

      if (this.interactive()) {
        carte.addControl(new this.lib.NavigationControl({ showCompass: false }), 'top-right');
      }
      carte.addControl(
        new this.lib.AttributionControl({
          compact: true,
          customAttribution: 'Fond de carte : référentiel D.A.S — Djibouti',
        }),
        'bottom-right',
      );
      const marquerPrete = () => {
        if (this.status() !== 'ready') {
          this.status.set('ready');
          this.drawPoints();
        }
      };
      // `load` couvre le cas nominal ; `idle` sert de filet si une ressource du
      // style (police distante, tuile lente) retarde l'événement `load`.
      carte.once('load', marquerPrete);
      carte.once('idle', marquerPrete);
      // Une fois la carte chargée, une tuile manquante ou une police lente ne
      // doit PAS afficher « fond de carte indisponible » par-dessus une carte
      // qui s'affiche correctement : on ne remonte l'erreur que si le style
      // lui-même n'a jamais abouti.
      carte.on('error', () => {
        if (this.status() !== 'ready') {
          this.status.set('error');
        }
      });
    } catch {
      this.status.set('error');
    }
  }

  /** Style D.A.S + résolution du service de tuiles de l'environnement. */
  private loadStyle(): Promise<StyleSpecification> {
    return new Promise((resolve, reject) => {
      this.http
        .get(environment.map.styleUrl, { responseType: 'text' })
        .pipe(
          rxMap(
            (raw) =>
              JSON.parse(
                raw.replaceAll('__TILES_BASE_URL__', environment.map.tilesUrl),
              ) as StyleSpecification,
          ),
        )
        .subscribe({ next: resolve, error: reject });
    });
  }

  private drawPoints(): void {
    const carte = this.map;
    const lib = this.lib;
    if (!carte || !lib) {
      return;
    }
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    const points = this.points();
    for (const point of points) {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = point.active ? 'lp-pin lp-pin--active' : 'lp-pin';
      element.setAttribute('aria-label', point.label);
      element.textContent = '✉';
      element.addEventListener('click', () => this.pointSelected.emit(point.id));

      const marker = new lib.Marker({ element })
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new lib.Popup({ offset: 18, closeButton: false }).setHTML(
            `<strong>${point.label}</strong>${point.sublabel ? `<br><span>${point.sublabel}</span>` : ''}`,
          ),
        )
        .addTo(carte);
      this.markers.push(marker);
    }

    if (points.length > 1) {
      const bounds = new lib.LngLatBounds();
      points.forEach((point) => bounds.extend([point.longitude, point.latitude]));
      carte.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 });
    } else if (points.length === 1) {
      carte.jumpTo({ center: [points[0].longitude, points[0].latitude], zoom: this.zoom() });
    }
  }
}
