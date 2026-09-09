import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';
import { UiFacade } from './store/ui/ui.facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly ui = inject(UiFacade);

  ngOnInit(): void {
    // Langue et session sont restaurées par l'app initializer (app.config.ts).
    this.watchConnection();
  }

  /** Alimente l'état "hors connexion" exigé par la section 8. */
  private watchConnection(): void {
    window.addEventListener('online', () => this.ui.connectionChanged(true));
    window.addEventListener('offline', () => this.ui.connectionChanged(false));
  }
}
