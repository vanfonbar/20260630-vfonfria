import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ProductCardComponent } from '@/components/product-card/product-card.component';
import { Product } from '@/interfaces/product.interface';
import { GetProductsUseCase } from '@/use-cases/get-products.use-case';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent]
})
export class CatalogPage {
  private readonly getProductsUseCase = inject(GetProductsUseCase);

  readonly products = signal<Product[]>([]);

  constructor() {
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    const raw = localStorage.getItem('cart');
    const cart: { product: Product; quantity: number }[] = raw ? JSON.parse(raw) : [];
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private loadProducts(): void {
    this.getProductsUseCase.execute().subscribe({
      next: (products) => {
        this.products.set(products);
      }
    });
  }
}
