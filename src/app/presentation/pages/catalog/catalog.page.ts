import { ChangeDetectionStrategy, Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, startWith, switchMap, catchError, of, tap } from 'rxjs';

import { MFormFieldComponent, MPrefixDirective, MSuffixDirective } from '@mercadona/components/form-field';
import { MInputDirective } from '@mercadona/components/input';
import { MTranslatePipe } from '@mercadona/core/translate';
import { MIconComponent } from '@mercadona/icons';

import { ProductCardComponent } from '@/components/product-card/product-card.component';
import { Product } from '@/interfaces/product.interface';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { SearchStateService } from '@/presentation/services/search-state.service';
import { PRODUCTS_USE_CASE, ProductsUseCase } from '@/use-cases/products.use-case.contract';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProductCardComponent,
    ReactiveFormsModule,
    MFormFieldComponent,
    MPrefixDirective,
    MSuffixDirective,
    MInputDirective,
    MIconComponent,
    MTranslatePipe
  ]
})
export class CatalogPageComponent {
  readonly #useCase: ProductsUseCase = inject(PRODUCTS_USE_CASE);
  readonly #cartStorage: CartStorageService = inject(CartStorageService);
  readonly #searchState: SearchStateService = inject(SearchStateService);

  protected readonly loadError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);

  protected readonly searchControl: FormControl<string> = new FormControl<string>(this.#searchState.searchTerm(), {
    nonNullable: true
  });

  protected readonly products: Signal<Product[]> = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(300),
      distinctUntilChanged(),
      tap((term: string) => {
        this.loading.set(true);
        this.loadError.set(false);
        this.#searchState.setSearchTerm(term);
      }),
      switchMap((term: string) => {
        const trimmed: string = term.trim();
        const source$: Observable<Product[]> =
          trimmed.length === 0 ? this.#useCase.getProducts() : this.#useCase.searchByName(trimmed);
        return source$.pipe(
          catchError((): Observable<Product[]> => {
            this.loadError.set(true);
            return of<Product[]>([]);
          }),
          tap(() => this.loading.set(false))
        );
      }),
      takeUntilDestroyed()
    ),
    { initialValue: [] as Product[] }
  );

  protected onClearSearch(input: MInputDirective): void {
    this.searchControl.setValue('');
    input.focus();
  }

  protected onAddToCart(product: Product): void {
    if (product.stock <= 0) {
      return;
    }
    this.#cartStorage.add(product);
  }
}
