import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { Language } from '../../core/models';
import { UiActions } from './ui.actions';
import { selectLanguage, selectMobileMenuOpen, selectOnline } from './ui.selectors';

@Injectable({ providedIn: 'root' })
export class UiFacade {
  private readonly store = inject(Store);

  readonly language = toSignal(this.store.select(selectLanguage), { initialValue: 'fr' as Language });
  readonly mobileMenuOpen = toSignal(this.store.select(selectMobileMenuOpen), {
    initialValue: false,
  });
  readonly online = toSignal(this.store.select(selectOnline), { initialValue: true });

  readonly language$ = this.store.select(selectLanguage);

  setLanguage(language: Language): void {
    this.store.dispatch(UiActions.setLanguage({ language }));
  }

  restoreLanguage(language: Language): void {
    this.store.dispatch(UiActions.restoreLanguage({ language }));
  }

  toggleMobileMenu(): void {
    this.store.dispatch(UiActions.toggleMobileMenu());
  }

  closeMobileMenu(): void {
    this.store.dispatch(UiActions.closeMobileMenu());
  }

  connectionChanged(online: boolean): void {
    this.store.dispatch(UiActions.connectionChanged({ online }));
  }
}
