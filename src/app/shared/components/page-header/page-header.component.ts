import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      @if (eyebrow()) {
        <p class="page-header__eyebrow">{{ eyebrow() }}</p>
      }
      <h1>{{ title() }}</h1>
      @if (subtitle()) {
        <p class="page-header__subtitle">{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: [
    `
      .page-header {
        margin-bottom: var(--lp-space-5);
      }
      .page-header__eyebrow {
        margin: 0 0 var(--lp-space-1);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--lp-blue-500);
      }
      .page-header__subtitle {
        margin: 0;
        max-width: 68ch;
        color: var(--lp-ink-soft);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly eyebrow = input('');
}
