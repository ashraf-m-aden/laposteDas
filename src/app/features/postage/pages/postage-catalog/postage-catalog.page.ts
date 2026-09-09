import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatePanelComponent } from '../../../../shared/components/state-panel/state-panel.component';
import { DjfPipe } from '../../../../shared/pipes/djf.pipe';
import type { PostageCategory, PostageProduct } from '../../../../core/models';
import { PostageFacade } from '../../store/postage.facade';

/** 6.8 Achat d'affranchissement - Choix du produit. */
@Component({
  selector: 'app-postage-catalog',
  imports: [PageHeaderComponent, StatePanelComponent, DjfPipe],
  templateUrl: './postage-catalog.page.html',
  styleUrl: './postage-catalog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostageCatalogPage implements OnInit {
  protected readonly facade = inject(PostageFacade);
  private readonly router = inject(Router);

  readonly categories: { code: PostageCategory | 'ALL'; label: string }[] = [
    { code: 'ALL', label: 'Tous' },
    { code: 'STAMP', label: 'Timbres' },
    { code: 'ENVELOPE', label: 'Enveloppes' },
    { code: 'PACK', label: 'Packs' },
    { code: 'COLLECTION', label: 'Collections' },
  ];

  readonly icons: Record<string, string> = {
    stamp: '🏷️',
    globe: '🌍',
    envelope: '✉️',
    box: '📦',
    collection: '🖼️',
  };

  ngOnInit(): void {
    this.facade.loadProducts();
  }

  choose(product: PostageProduct): void {
    this.facade.selectProduct(product.id);
    this.router.navigate(['/affranchissement/tarif']);
  }
}
