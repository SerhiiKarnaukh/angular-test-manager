import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ProductCardComponent } from '@features/taberna/components/product-card/product-card.component';
import { TabernaProduct } from '@features/taberna/data-access/taberna-product.models';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCardComponent],
  template: `
    <div
      class="products-grid"
      [class.cols-1]="gridCols() === 1"
      [class.cols-2]="gridCols() === 2"
      [class.cols-3]="gridCols() === 3"
    >
      @for (product of products(); track product.id) {
        <app-product-card [product]="product" />
      }
    </div>
  `,
  styles: `
    .products-grid {
      display: grid;
      gap: 16px;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 48px) 24px;
      box-sizing: border-box;
    }

    .cols-1 {
      grid-template-columns: 1fr;
    }

    .cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  `,
})
export class ProductsGridComponent {
  readonly products = input.required<TabernaProduct[]>();

  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly gridCols = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(
        map((state) => {
          if (state.breakpoints[Breakpoints.HandsetPortrait]) {
            return 1;
          }
          if (state.breakpoints[Breakpoints.TabletPortrait]) {
            return 2;
          }
          return 3;
        }),
      ),
    { initialValue: 3 },
  );
}
