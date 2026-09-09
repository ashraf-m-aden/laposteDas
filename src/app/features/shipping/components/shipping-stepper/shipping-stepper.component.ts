import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-shipping-stepper',
  template: `
    <ol class="stepper" aria-label="Étapes de l'envoi">
      @for (label of labels; track label; let i = $index) {
        <li
          class="stepper__item"
          [class.stepper__item--done]="current() > i + 1"
          [class.stepper__item--active]="current() === i + 1"
          [attr.aria-current]="current() === i + 1 ? 'step' : null"
        >
          <span class="stepper__index">{{ i + 1 }}</span>
          <span class="stepper__label">{{ label }}</span>
        </li>
      }
    </ol>
  `,
  styles: [
    `
      .stepper {
        display: flex;
        gap: var(--lp-space-3);
        list-style: none;
        margin: 0 0 var(--lp-space-5);
        padding: 0;
        flex-wrap: wrap;
      }
      .stepper__item {
        display: flex;
        align-items: center;
        gap: var(--lp-space-2);
        padding: var(--lp-space-2) var(--lp-space-4);
        border-radius: var(--lp-radius-pill);
        background: var(--lp-surface);
        border: 1px solid var(--lp-line);
        color: var(--lp-ink-muted);
        font-size: 0.92rem;
      }
      .stepper__index {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--lp-surface-alt);
        font-weight: 700;
        font-size: 0.8rem;
      }
      .stepper__item--active {
        border-color: var(--lp-blue-700);
        color: var(--lp-blue-900);
        font-weight: 700;
      }
      .stepper__item--active .stepper__index {
        background: var(--lp-blue-700);
        color: #fff;
      }
      .stepper__item--done {
        border-color: var(--lp-green-600);
        color: var(--lp-green-600);
      }
      .stepper__item--done .stepper__index {
        background: var(--lp-green-100);
        color: var(--lp-green-600);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingStepperComponent {
  readonly current = input.required<number>();
  readonly labels = ['Expéditeur & destinataire', 'Prestation', 'Récapitulatif'];
}
