import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { StatusTonePipe } from '../../../../shared/pipes/status-tone.pipe';
import { AuthFacade } from '../../../../store/auth/auth.facade';
import { UiFacade } from '../../../../store/ui/ui.facade';
import type { Language } from '../../../../core/models';

/** 6.21 Mon compte - Profil et préférences. */
@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent, StatusLabelPipe, StatusTonePipe],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ui = inject(UiFacade);
  protected readonly auth = inject(AuthFacade);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    language: ['fr' as Language, Validators.required],
    emailNotifications: [true],
    smsNotifications: [false],
    pushNotifications: [false],
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        ...user.preferences,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.auth.updateProfile({
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      preferences: {
        language: value.language,
        emailNotifications: value.emailNotifications,
        smsNotifications: value.smsNotifications,
        pushNotifications: value.pushNotifications,
      },
    });
    // La langue de l'interface suit la préférence enregistrée.
    this.ui.setLanguage(value.language);
  }
}
