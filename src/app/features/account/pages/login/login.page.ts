import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { ToastFacade } from '../../../../store/toast/toast.facade';

/** 6.20 Mon compte - Connexion. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastFacade);
  protected readonly auth = inject(AuthFacade);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.login(this.form.getRawValue());
  }

  /** Raccourci de démonstration (comptes factices). */
  fill(kind: 'individual' | 'business'): void {
    this.form.setValue({
      email: kind === 'individual' ? 'client@laposte.dj' : 'pro@marill.dj',
      password: 'demo1234',
    });
  }

  forgotPassword(): void {
    this.toast.info(
      'Un lien de réinitialisation sera envoyé par le back-end postal une fois branché.',
      'Mot de passe oublié',
    );
  }
}
