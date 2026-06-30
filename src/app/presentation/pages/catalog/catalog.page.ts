import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';

import { MTranslatePipe } from '@mercadona/core/translate';

import { ProductCardComponent } from '@/components/product-card/product-card.component';
import { Product } from '@/interfaces/product.interface';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { PRODUCTS_USE_CASE, ProductsUseCase } from '@/use-cases/products.use-case.contract';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, MTranslatePipe]
})
export class CatalogPageComponent {
  readonly #useCase: ProductsUseCase = inject(PRODUCTS_USE_CASE);
  readonly #cartStorage: CartStorageService = inject(CartStorageService);

  protected readonly loadError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly products: Signal<Product[]> = toSignal(
    this.#useCase.getProducts().pipe(
      catchError((): Observable<Product[]> => {
        this.loadError.set(true);
        return of<Product[]>([]);
      })
    ),
    { initialValue: [] as Product[] }
  );

  protected onAddToCart(product: Product): void {
    if (product.stock <= 0) {
      return;
    }
    this.#cartStorage.add(product);
  }
}
