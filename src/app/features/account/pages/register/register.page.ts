import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import type { AccountType } from '../../../../core/models';

/** 6.20 Inscription particulier et 6.14 Inscription professionnelle. */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthFacade);

  protected readonly accountType = signal<AccountType>('INDIVIDUAL');
  protected readonly isBusiness = computed(() => this.accountType() === 'BUSINESS');

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{6,20}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    companyName: [''],
    legalId: [''],
  });

  setType(type: AccountType): void {
    this.accountType.set(type);
    const companyName = this.form.controls.companyName;
    const legalId = this.form.controls.legalId;
    if (type === 'BUSINESS') {
      companyName.addValidators(Validators.required);
      legalId.addValidators(Validators.required);
    } else {
      companyName.clearValidators();
      legalId.clearValidators();
    }
    companyName.updateValueAndValidity();
    legalId.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.auth.register({
      type: this.accountType(),
      email: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      companyName: this.isBusiness() ? value.companyName : undefined,
      legalId: this.isBusiness() ? value.legalId : undefined,
    });
  }
}
