import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastFacade } from '../../../store/toast/toast.facade';
import type { Toast } from '../../../store/toast/toast.model';

/**
 * Pile de notifications toast.
 * Purement présentationnel : l'état vient du store via `ToastFacade`.
 */
@Component({
  selector: 'app-toast-container',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  private readonly facade = inject(ToastFacade);

  readonly toasts = this.facade.toasts;

  readonly icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '!',
    warning: '⚠',
    info: 'i',
  };

  trackById(_index: number, toast: Toast): string {
    return toast.id;
  }

  dismiss(id: string): void {
    this.facade.dismiss(id);
  }
}
