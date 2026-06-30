import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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
import { MPaginatorEvent, MPaginatorNumberedComponent } from '@mercadona/components/paginator';
import { MSpinnerDirective } from '@mercadona/components/spinner';
import { MTranslatePipe } from '@mercadona/core/translate';
import { MIconComponent } from '@mercadona/icons';

import { CategoryFilterComponent } from '@/components/category-filter/category-filter.component';
import { ProductCardComponent } from '@/components/product-card/product-card.component';
import { CATALOG_PAGE_SIZE } from '@/entities/constants/catalog.constants';
import { parseCategory } from '@/entities/utils/category.utils';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { SearchStateService } from '@/presentation/services/search-state.service';
import { PRODUCTS_USE_CASE, ProductsUseCase } from '@/use-cases/products.use-case.contract';

/*
 * Se elige paginación sobre scroll infinito por tres motivos:
 * 1. El filtrado es completamente client-side: todos los productos ya están en memoria.
 *    El scroll infinito sobre un dataset precargado solo simularía carga diferida —
 *    añade complejidad (gestión de "ventanas") que se invalida entera con cada cambio
 *    de búsqueda o categoría. La paginación simplemente hace slice() del array.
 * 2. Mejor accesibilidad: los controles de página son navegables por teclado y
 *    anunciables por lectores de pantalla sin lógica adicional.
 * 3. El componente m-paginator-numbered del design system MUS encaja directamente
 *    con el patrón de catálogo visual de productos.
 */

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
    MPaginatorNumberedComponent,
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

  protected readonly PAGE_SIZE = CATALOG_PAGE_SIZE;

  protected readonly loadError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly pageIndex: WritableSignal<number> = signal<number>(0);

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
        this.pageIndex.set(0);
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

  protected readonly paginatedProducts: Signal<Product[]> = computed<Product[]>(() => {
    const start: number = this.pageIndex() * this.PAGE_SIZE;
    return this.products().slice(start, start + this.PAGE_SIZE);
  });

  protected onPage(event: MPaginatorEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

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
