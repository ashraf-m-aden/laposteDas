import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="lp-page">
      <div class="lp-container wrapper">
        <div class="lp-card">
          <p class="code">404</p>
          <h1>Page introuvable</h1>
          <p class="lp-hint">La page demandée n'existe pas ou a été déplacée.</p>
          <a class="lp-btn" routerLink="/">Retour à l'accueil</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .wrapper {
        max-width: 520px;
      }
      .lp-card {
        text-align: center;
      }
      .code {
        margin: 0;
        font-size: 3rem;
        font-weight: 800;
        color: var(--lp-blue-100);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
