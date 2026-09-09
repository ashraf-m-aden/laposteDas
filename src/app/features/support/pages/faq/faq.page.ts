import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { SupportFacade } from '../../store/support.facade';

/** 6.18 Notifications et support - FAQ. */
@Component({
  selector: 'app-faq',
  imports: [FormsModule, RouterLink, PageHeaderComponent, StatePanelComponent],
  templateUrl: './faq.page.html',
  styleUrl: './faq.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqPage implements OnInit {
  protected readonly facade = inject(SupportFacade);
  protected readonly openId = signal<string | null>(null);

  ngOnInit(): void {
    this.facade.loadFaq();
  }

  toggle(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }
}
