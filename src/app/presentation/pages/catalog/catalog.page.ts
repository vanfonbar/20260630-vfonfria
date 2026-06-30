import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap
} from 'rxjs';

import { MButtonComponent } from '@mercadona/components/button';
import { MFormFieldComponent, MPrefixDirective, MSuffixDirective } from '@mercadona/components/form-field';
import { MInputDirective } from '@mercadona/components/input';
import { MSpinnerDirective } from '@mercadona/components/spinner';
import { MTranslatePipe } from '@mercadona/core/translate';
import { MIconComponent } from '@mercadona/icons';

import { CategoryFilterComponent } from '@/components/category-filter/category-filter.component';
import { ProductCardComponent } from '@/components/product-card/product-card.component';
import { parseCategory } from '@/entities/utils/category.utils';
import { Category } from '@/enums/category.enum';
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
    CategoryFilterComponent,
    ReactiveFormsModule,
    MFormFieldComponent,
    MPrefixDirective,
    MSuffixDirective,
    MInputDirective,
    MIconComponent,
    MSpinnerDirective,
    MButtonComponent,
    MTranslatePipe
  ]
})
export class CatalogPageComponent {
  readonly #useCase: ProductsUseCase = inject(PRODUCTS_USE_CASE);
  readonly #cartStorage: CartStorageService = inject(CartStorageService);
  readonly #searchState: SearchStateService = inject(SearchStateService);
  readonly #route: ActivatedRoute = inject(ActivatedRoute);
  readonly #router: Router = inject(Router);
  readonly #retry$: Subject<string> = new Subject<string>();

  protected readonly loadError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);

  protected readonly searchControl: FormControl<string> = new FormControl<string>(this.#searchState.searchTerm(), {
    nonNullable: true
  });

  protected readonly activeCategory: Signal<Category | null> = toSignal(
    this.#route.queryParamMap.pipe(map((params) => parseCategory(params.get('category')))),
    { initialValue: null }
  );

  protected readonly products: Signal<Product[]> = toSignal(
    combineLatest([
      merge(
        this.searchControl.valueChanges.pipe(
          startWith(this.searchControl.value),
          debounceTime(300),
          distinctUntilChanged()
        ),
        this.#retry$
      ),
      this.#route.queryParamMap.pipe(map((params) => parseCategory(params.get('category'))))
    ]).pipe(
      tap(([term]: [string, Category | null]) => {
        this.loading.set(true);
        this.loadError.set(false);
        this.#searchState.setSearchTerm(term);
      }),
      switchMap(([term, category]: [string, Category | null]): Observable<Product[]> => {
        const source$: Observable<Product[]> = category
          ? this.#useCase.getProductsByCategory(category)
          : this.#useCase.getProducts();

        const trimmed: string = term.trim().toLowerCase();
        return source$.pipe(
          map((products: Product[]): Product[] =>
            trimmed.length === 0
              ? products
              : products.filter((p: Product): boolean => p.name.toLowerCase().includes(trimmed))
          ),
          catchError((): Observable<Product[]> => {
            this.loadError.set(true);
            return of<Product[]>([]);
          }),
          tap((): void => this.loading.set(false))
        );
      }),
      takeUntilDestroyed()
    ),
    { initialValue: [] as Product[] }
  );

  protected retry(): void {
    this.#retry$.next(this.searchControl.value);
  }

  protected onCategoryChange(category: Category | null): void {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { category: category ?? null },
      queryParamsHandling: 'merge'
    });
  }

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
