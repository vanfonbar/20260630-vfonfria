import { CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { CatalogPageComponent } from './catalog.page';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { SearchStateService } from '@/presentation/services/search-state.service';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';
import { PRODUCTS_USE_CASE, ProductsUseCase } from '@/use-cases/products.use-case.contract';

// ─── Fixtures de datos ────────────────────────────────────────────────────────

const PRODUCT_LECHE: Product = {
  id: '1',
  name: 'Leche entera 1L',
  description: 'Leche de vaca',
  price: 0.89,
  category: Category.DAIRY,
  imageUrl: 'https://example.com/leche.jpg',
  stock: 150,
  attributes: {}
};

const PRODUCT_YOGUR: Product = {
  id: '2',
  name: 'Yogur natural',
  description: 'Yogur de vaca',
  price: 1.2,
  category: Category.DAIRY,
  imageUrl: 'https://example.com/yogur.jpg',
  stock: 80,
  attributes: {}
};

const PRODUCT_PAN: Product = {
  id: '3',
  name: 'Pan de molde integral',
  description: 'Pan integral',
  price: 1.35,
  category: Category.BAKERY,
  imageUrl: 'https://example.com/pan.jpg',
  stock: 60,
  attributes: {}
};

const PRODUCT_AGOTADO: Product = {
  id: '4',
  name: 'Tomate cherry',
  description: 'Tomate sin stock',
  price: 1.99,
  category: Category.FRESH,
  imageUrl: 'https://example.com/tomate.jpg',
  stock: 0,
  attributes: {}
};

const ALL_PRODUCTS: Product[] = [PRODUCT_LECHE, PRODUCT_YOGUR, PRODUCT_PAN, PRODUCT_AGOTADO];
const DAIRY_PRODUCTS: Product[] = [PRODUCT_LECHE, PRODUCT_YOGUR];

// Acceso a miembros protegidos desde tests
const access = (c: CatalogPageComponent): any => c as any;

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CatalogPageComponent', () => {
  let fixture: ComponentFixture<CatalogPageComponent>;
  let component: CatalogPageComponent;
  let useCaseSpy: jasmine.SpyObj<ProductsUseCase>;
  let cartStorageSpy: jasmine.SpyObj<CartStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockQueryParamMap: BehaviorSubject<ParamMap>;
  let searchStateService: SearchStateService;

  beforeEach(() => {
    mockQueryParamMap = new BehaviorSubject<ParamMap>(convertToParamMap({}));

    useCaseSpy = jasmine.createSpyObj<ProductsUseCase>('ProductsUseCase', [
      'getProducts',
      'getProductsByCategory',
      'searchByName'
    ]);
    cartStorageSpy = jasmine.createSpyObj<CartStorageService>('CartStorageService', ['add']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));
    useCaseSpy.getProductsByCategory.and.callFake((cat: Category) =>
      of(ALL_PRODUCTS.filter((p: Product) => p.category === cat))
    );

    TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMTranslateTesting(),
        { provide: PRODUCTS_USE_CASE, useValue: useCaseSpy },
        { provide: CartStorageService, useValue: cartStorageSpy },
        { provide: ActivatedRoute, useValue: { queryParamMap: mockQueryParamMap.asObservable() } },
        { provide: Router, useValue: routerSpy },
        SearchStateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    searchStateService = TestBed.inject(SearchStateService);
  });

  /**
   *
   */
  function createComponent(): void {
    fixture = TestBed.createComponent(CatalogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  // ─── Inicialización ───────────────────────────────────────────────────────────

  describe('Inicialización', () => {
    it('should create the component', fakeAsync(() => {
      createComponent();
      tick(300);

      expect(component).toBeTruthy();
    }));

    it('should call getProducts on init when URL has no category param', fakeAsync(() => {
      createComponent();
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(useCaseSpy.getProductsByCategory).not.toHaveBeenCalled();
    }));

    it('should never call the use case searchByName (search is handled client-side)', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('leche');
      tick(300);

      expect(useCaseSpy.searchByName).not.toHaveBeenCalled();
    }));

    it('should show all products on initial load', fakeAsync(() => {
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(ALL_PRODUCTS);
    }));

    it('should have null activeCategory when URL has no category param', fakeAsync(() => {
      createComponent();
      tick(300);

      expect(access(component).activeCategory()).toBeNull();
    }));

    it('should restore search term from SearchStateService on init', fakeAsync(() => {
      searchStateService.setSearchTerm('leche');
      createComponent();
      tick(300);

      expect(access(component).searchControl.value).toBe('leche');
    }));
  });

  // ─── Filtro por categoría: URL → Componente ───────────────────────────────────

  describe('Filtro por categoría: URL → Componente', () => {
    it('should call getProductsByCategory(DAIRY) when URL has ?category=lacteos on init', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);

      expect(useCaseSpy.getProductsByCategory).toHaveBeenCalledOnceWith(Category.DAIRY);
      expect(useCaseSpy.getProducts).not.toHaveBeenCalled();
    }));

    it('should set activeCategory to DAIRY when URL has ?category=lacteos', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);

      expect(access(component).activeCategory()).toBe(Category.DAIRY);
    }));

    it('should show only DAIRY products when URL has ?category=lacteos', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(DAIRY_PRODUCTS);
    }));

    it('should fall back to getProducts and null activeCategory when URL has an invalid category', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'invalida' }));
      createComponent();
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(access(component).activeCategory()).toBeNull();
    }));

    it('should update products when category param is added after component creation', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.getProductsByCategory.calls.reset();

      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      tick(0);
      fixture.detectChanges();

      expect(useCaseSpy.getProductsByCategory).toHaveBeenCalledOnceWith(Category.DAIRY);
      expect(access(component).products()).toEqual(DAIRY_PRODUCTS);
    }));

    it('should call getProducts when category param is removed from URL', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);
      useCaseSpy.getProducts.calls.reset();

      mockQueryParamMap.next(convertToParamMap({}));
      tick(0);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(access(component).activeCategory()).toBeNull();
    }));

    it('should switch categories when the URL param changes', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);

      mockQueryParamMap.next(convertToParamMap({ category: 'panaderia' }));
      tick(0);

      expect(useCaseSpy.getProductsByCategory).toHaveBeenCalledWith(Category.BAKERY);
      expect(access(component).activeCategory()).toBe(Category.BAKERY);
    }));
  });

  // ─── Filtro por categoría: Componente → URL ───────────────────────────────────

  describe('Filtro por categoría: Componente → URL', () => {
    it('should navigate with ?category=lacteos when onCategoryChange(DAIRY) is called', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onCategoryChange(Category.DAIRY);

      expect(routerSpy.navigate).toHaveBeenCalledOnceWith([], {
        relativeTo: jasmine.any(Object),
        queryParams: { category: 'lacteos' },
        queryParamsHandling: 'merge'
      });
    }));

    it('should navigate with category=null when onCategoryChange(null) is called', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onCategoryChange(null);

      expect(routerSpy.navigate).toHaveBeenCalledOnceWith([], {
        relativeTo: jasmine.any(Object),
        queryParams: { category: null },
        queryParamsHandling: 'merge'
      });
    }));

    it('should use queryParamsHandling "merge" to preserve other query params', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onCategoryChange(Category.FRESH);

      const navArgs = routerSpy.navigate.calls.mostRecent().args;
      expect(navArgs[1]?.queryParamsHandling).toBe('merge');
    }));
  });

  // ─── Búsqueda por nombre (client-side) ────────────────────────────────────────

  describe('Búsqueda por nombre', () => {
    it('should filter products client-side after debounce', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('leche');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_LECHE]);
    }));

    it('should debounce: multiple rapid changes trigger only one request', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.getProducts.calls.reset();

      access(component).searchControl.setValue('p');
      access(component).searchControl.setValue('pa');
      access(component).searchControl.setValue('pan');
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
    }));

    it('should show all products when search is cleared', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('leche');
      tick(300);

      access(component).searchControl.setValue('');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(ALL_PRODUCTS);
    }));

    it('should be case-insensitive', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('LECHE');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_LECHE]);
    }));

    it('should trim whitespace before filtering', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('  leche  ');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_LECHE]);
    }));

    it('should show all products when search contains only whitespace', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('   ');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(ALL_PRODUCTS);
    }));

    it('should persist search term to SearchStateService', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('yogur');
      tick(300);

      expect(searchStateService.searchTerm()).toBe('yogur');
    }));
  });

  // ─── Búsqueda + Categoría combinados ─────────────────────────────────────────

  describe('Búsqueda + Categoría combinados', () => {
    it('should filter by name within the active category results', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);

      access(component).searchControl.setValue('yogur');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_YOGUR]);
    }));

    it('should show all category products when search is cleared while category is active', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);
      access(component).searchControl.setValue('yogur');
      tick(300);

      access(component).searchControl.setValue('');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(DAIRY_PRODUCTS);
    }));

    it('should re-apply current search when category changes', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('leche');
      tick(300);

      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      tick(0);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_LECHE]);
    }));

    it('should return empty array when search term has no match within the category', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);

      access(component).searchControl.setValue('pan');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([]);
    }));
  });

  // ─── Estado de carga ──────────────────────────────────────────────────────────

  describe('Estado de carga', () => {
    it('should be in loading state before the first emission', fakeAsync(() => {
      createComponent();

      expect(access(component).loading()).toBeTrue();
    }));

    it('should stop loading after products are fetched', fakeAsync(() => {
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).loading()).toBeFalse();
    }));
  });

  // ─── Manejo de errores ────────────────────────────────────────────────────────

  describe('Manejo de errores', () => {
    it('should set loadError to true when getProducts fails', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('API error')));
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeTrue();
      expect(access(component).products()).toEqual([]);
    }));

    it('should set loadError to true when getProductsByCategory fails', fakeAsync(() => {
      useCaseSpy.getProductsByCategory.and.returnValue(throwError(() => new Error('API error')));
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeTrue();
      expect(access(component).products()).toEqual([]);
    }));

    it('should reset loadError when a subsequent search succeeds after an error', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);

      useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));
      access(component).searchControl.setValue('leche');
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeFalse();
    }));

    it('should reset loadError when category changes and the request succeeds', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);

      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      tick(0);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeFalse();
      expect(access(component).products()).toEqual(DAIRY_PRODUCTS);
    }));
  });

  // ─── Añadir al carrito ────────────────────────────────────────────────────────

  describe('Añadir al carrito', () => {
    it('should call CartStorageService.add when product has stock', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onAddToCart(PRODUCT_LECHE);

      expect(cartStorageSpy.add).toHaveBeenCalledOnceWith(PRODUCT_LECHE);
    }));

    it('should NOT call CartStorageService.add when product is out of stock', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onAddToCart(PRODUCT_AGOTADO);

      expect(cartStorageSpy.add).not.toHaveBeenCalled();
    }));
  });

  // ─── Reintentar ──────────────────────────────────────────────────────────────

  describe('Reintentar', () => {
    it('should re-trigger getProducts when retry() is called after an error', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);
      useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));

      access(component).retry();
      tick(0);

      expect(useCaseSpy.getProducts).toHaveBeenCalledTimes(2);
    }));

    it('should reset loadError to false when retry succeeds', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);
      useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));

      access(component).retry();
      tick(0);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeFalse();
    }));

    it('should restore products when retry succeeds', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);
      useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));

      access(component).retry();
      tick(0);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(ALL_PRODUCTS);
    }));

    it('should keep loadError true when retry also fails', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);

      access(component).retry();
      tick(0);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeTrue();
    }));

    it('should re-trigger getProductsByCategory when retry() is called with an active category', fakeAsync(() => {
      mockQueryParamMap.next(convertToParamMap({ category: 'lacteos' }));
      useCaseSpy.getProductsByCategory.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);
      useCaseSpy.getProductsByCategory.and.returnValue(of(DAIRY_PRODUCTS));

      access(component).retry();
      tick(0);

      expect(useCaseSpy.getProductsByCategory).toHaveBeenCalledTimes(2);
      expect(useCaseSpy.getProductsByCategory).toHaveBeenCalledWith(Category.DAIRY);
    }));

    it('should preserve current search term when retrying', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('yogur');
      tick(300);
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      access(component).searchControl.setValue('leche');
      tick(300);
      useCaseSpy.getProducts.and.returnValue(of(ALL_PRODUCTS));

      access(component).retry();
      tick(0);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([PRODUCT_LECHE]);
    }));
  });

  // ─── Limpiar búsqueda ─────────────────────────────────────────────────────────

  describe('Limpiar búsqueda', () => {
    it('should reset searchControl to empty string', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('pan');
      tick(300);
      const mockInput = jasmine.createSpyObj('MInputDirective', ['focus']);

      access(component).onClearSearch(mockInput);

      expect(access(component).searchControl.value).toBe('');
    }));

    it('should focus the input after clearing', fakeAsync(() => {
      createComponent();
      tick(300);
      const mockInput = jasmine.createSpyObj('MInputDirective', ['focus']);

      access(component).onClearSearch(mockInput);

      expect(mockInput.focus).toHaveBeenCalled();
    }));
  });
});
