import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TabernaCartStore } from '@features/taberna/cart/data-access/taberna-cart.store';
import { TabernaProductStore } from '@features/taberna/data-access/taberna-product.store';
import { TabernaVariationOption } from '@features/taberna/data-access/taberna-product.models';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  private readonly productStore = inject(TabernaProductStore);
  private readonly cartStore = inject(TabernaCartStore);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly productDetail = this.productStore.productDetail;
  protected readonly isLoading = this.productStore.isLoading;

  protected readonly selectedColor = signal<TabernaVariationOption | null>(null);
  protected readonly selectedSize = signal<TabernaVariationOption | null>(null);
  protected readonly colorError = signal('');
  protected readonly sizeError = signal('');
  protected readonly activeImageIndex = signal(0);

  protected readonly galleryImages = computed(() => {
    const product = this.productDetail().product;
    const gallery = product.productgallery?.map((item) => item.image) ?? [];
    return product.image ? [product.image, ...gallery] : gallery;
  });

  protected compareVariations(
    first: TabernaVariationOption | null,
    second: TabernaVariationOption | null,
  ): boolean {
    return first?.variation_value === second?.variation_value;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const categorySlug = params.get('category_slug');
      const productSlug = params.get('product_slug');
      if (!categorySlug || !productSlug) {
        return;
      }

      this.resetSelections();
      void this.loadProduct(categorySlug, productSlug);
    });
  }

  ngOnDestroy(): void {
    this.productStore.clearProductDetail();
  }

  protected showPreviousImage(): void {
    const images = this.galleryImages();
    if (!images.length) {
      return;
    }

    const nextIndex = (this.activeImageIndex() - 1 + images.length) % images.length;
    this.activeImageIndex.set(nextIndex);
  }

  protected showNextImage(): void {
    const images = this.galleryImages();
    if (!images.length) {
      return;
    }

    const nextIndex = (this.activeImageIndex() + 1) % images.length;
    this.activeImageIndex.set(nextIndex);
  }

  protected async addToCart(): Promise<void> {
    this.colorError.set('');
    this.sizeError.set('');

    const color = this.selectedColor();
    const size = this.selectedSize();

    if (!color) {
      this.colorError.set('Please select a color');
    }
    if (!size) {
      this.sizeError.set('Please select a size');
    }
    if (!color || !size) {
      return;
    }

    const productId = this.productDetail().product.id;
    await this.cartStore.addToCart(productId, color.variation_value, size.variation_value);
    await this.cartStore.loadCart();

    this.snackBar.open('The product was added to the cart', 'Close', {
      duration: 4000,
      panelClass: 'app-message-success',
    });
  }

  private resetSelections(): void {
    this.selectedColor.set(null);
    this.selectedSize.set(null);
    this.colorError.set('');
    this.sizeError.set('');
    this.activeImageIndex.set(0);
  }

  private async loadProduct(categorySlug: string, productSlug: string): Promise<void> {
    await this.productStore.loadProductDetail(categorySlug, productSlug);
    const name = this.productStore.productDetail().product.name;
    if (name) {
      this.title.setTitle(`${name} | Taberna`);
    }
  }
}
