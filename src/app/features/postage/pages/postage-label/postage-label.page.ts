import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import { ToastFacade } from '../../../../store/toast/toast.facade';
import { PostageFacade } from '../../store/postage.facade';

/** 6.10 Achat d'affranchissement - Étiquette / timbre. */
@Component({
  selector: 'app-postage-label',
  imports: [DatePipe, RouterLink, PageHeaderComponent, DjfPipe],
  templateUrl: './postage-label.page.html',
  styleUrl: './postage-label.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostageLabelPage implements OnInit {
  protected readonly facade = inject(PostageFacade);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastFacade);

  ngOnInit(): void {
    if (!this.facade.label()) {
      this.router.navigate(['/affranchissement']);
    }
  }

  /** En mock, le document n'existe pas : on l'indique explicitement. */
  download(): void {
    this.toast.info(
      'En mode maquette, le PDF est généré par le back-end postal. Aucun fichier réel ici.',
      'Téléchargement',
    );
  }

  print(): void {
    window.print();
  }

  sendByEmail(): void {
    this.toast.success("L'étiquette a été envoyée à l'adresse e-mail du compte.");
  }
}
