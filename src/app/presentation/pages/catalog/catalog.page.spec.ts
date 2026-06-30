import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZonelessChangeDetection, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { CatalogPageComponent } from './catalog.page';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { SearchStateService } from '@/presentation/services/search-state.service';
import { PRODUCTS_USE_CASE, ProductsUseCase } from '@/use-cases/products.use-case.contract';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Leche entera Hacendado 1L',
    description: 'Leche de vaca',
    price: 0.89,
    category: Category.DAIRY,
    imageUrl: 'https://example.com/leche.jpg',
    stock: 150,
    attributes: {}
  },
  {
    id: '2',
    name: 'Pan de molde integral',
    description: 'Pan integral',
    price: 1.35,
    category: Category.BAKERY,
    imageUrl: 'https://example.com/pan.jpg',
    stock: 80,
    attributes: {}
  }
];

const OUT_OF_STOCK_PRODUCT: Product = {
  id: '3',
  name: 'Plátanos de Canarias',
  description: 'Plátanos IGP',
  price: 1.49,
  category: Category.FRESH,
  imageUrl: 'https://example.com/platanos.jpg',
  stock: 0,
  attributes: {}
};

// Helper to access protected members from tests
 
const access = (c: CatalogPageComponent): any => c as any;

describe('CatalogPageComponent', () => {
  let fixture: ComponentFixture<CatalogPageComponent>;
  let component: CatalogPageComponent;
  let useCaseSpy: jasmine.SpyObj<ProductsUseCase>;
  let cartStorageSpy: jasmine.SpyObj<CartStorageService>;
  let searchStateService: SearchStateService;

  beforeEach(() => {
    useCaseSpy = jasmine.createSpyObj<ProductsUseCase>('ProductsUseCase', ['getProducts', 'searchByName']);
    cartStorageSpy = jasmine.createSpyObj<CartStorageService>('CartStorageService', ['add']);

    useCaseSpy.getProducts.and.returnValue(of(MOCK_PRODUCTS));
    useCaseSpy.searchByName.and.returnValue(of([MOCK_PRODUCTS[0]]));

    TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMTranslateTesting(),
        { provide: PRODUCTS_USE_CASE, useValue: useCaseSpy },
        { provide: CartStorageService, useValue: cartStorageSpy },
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

  describe('Inicialización', () => {
    it('should create the component', fakeAsync(() => {
      createComponent();
      tick(300);

      expect(component).toBeTruthy();
    }));

    it('should call getProducts on init when search state is empty', fakeAsync(() => {
      createComponent();
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(useCaseSpy.searchByName).not.toHaveBeenCalled();
    }));

    it('should restore search term from SearchStateService on init', fakeAsync(() => {
      searchStateService.setSearchTerm('leche');

      createComponent();
      tick(300);

      expect(access(component).searchControl.value).toBe('leche');
      expect(useCaseSpy.searchByName).toHaveBeenCalledOnceWith('leche');
    }));

    it('should show all products on initial load', fakeAsync(() => {
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual(MOCK_PRODUCTS);
    }));
  });

  describe('Búsqueda', () => {
    it('should call searchByName after 300ms debounce when typing', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.getProducts.calls.reset();

      access(component).searchControl.setValue('pan');

      expect(useCaseSpy.searchByName).not.toHaveBeenCalled();

      tick(300);

      expect(useCaseSpy.searchByName).toHaveBeenCalledOnceWith('pan');
    }));

    it('should debounce: multiple rapid changes trigger only one request', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.searchByName.calls.reset();

      access(component).searchControl.setValue('p');
      access(component).searchControl.setValue('pa');
      access(component).searchControl.setValue('pan');

      tick(300);

      expect(useCaseSpy.searchByName).toHaveBeenCalledOnceWith('pan');
    }));

    it('should call getProducts when search is cleared', fakeAsync(() => {
      createComponent();
      tick(300);
      access(component).searchControl.setValue('pan');
      tick(300);
      useCaseSpy.getProducts.calls.reset();

      access(component).searchControl.setValue('');
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(useCaseSpy.searchByName).toHaveBeenCalledTimes(1);
    }));

    it('should trim whitespace before searching', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('  leche  ');
      tick(300);

      expect(useCaseSpy.searchByName).toHaveBeenCalledOnceWith('leche');
    }));

    it('should call getProducts when input contains only whitespace', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.getProducts.calls.reset();

      access(component).searchControl.setValue('   ');
      tick(300);

      expect(useCaseSpy.getProducts).toHaveBeenCalledOnceWith();
      expect(useCaseSpy.searchByName).not.toHaveBeenCalled();
    }));

    it('should persist search term to SearchStateService', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('leche');
      tick(300);

      expect(searchStateService.searchTerm()).toBe('leche');
    }));

    it('should update products signal after search', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).searchControl.setValue('leche');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([MOCK_PRODUCTS[0]]);
    }));
  });

  describe('Estado sin resultados', () => {
    it('should return empty array when search finds no products', fakeAsync(() => {
      useCaseSpy.searchByName.and.returnValue(of([]));
      createComponent();
      tick(300);

      access(component).searchControl.setValue('xyzinexistente');
      tick(300);
      fixture.detectChanges();

      expect(access(component).products()).toEqual([]);
    }));

    it('should not show empty message while still loading', fakeAsync(() => {
      createComponent();

      expect(access(component).loading()).toBeTrue();
    }));
  });

  describe('Manejo de errores', () => {
    it('should set loadError to true when getProducts fails', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('API error')));
      createComponent();
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeTrue();
      expect(access(component).products()).toEqual([]);
    }));

    it('should set loadError to true when searchByName fails', fakeAsync(() => {
      createComponent();
      tick(300);
      useCaseSpy.searchByName.and.returnValue(throwError(() => new Error('API error')));

      access(component).searchControl.setValue('leche');
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeTrue();
    }));

    it('should reset loadError when a new search succeeds after an error', fakeAsync(() => {
      useCaseSpy.getProducts.and.returnValue(throwError(() => new Error('error')));
      createComponent();
      tick(300);
      useCaseSpy.searchByName.and.returnValue(of(MOCK_PRODUCTS));

      access(component).searchControl.setValue('leche');
      tick(300);
      fixture.detectChanges();

      expect(access(component).loadError()).toBeFalse();
    }));
  });

  describe('Añadir al carrito', () => {
    it('should call CartStorageService.add when product has stock', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onAddToCart(MOCK_PRODUCTS[0]);

      expect(cartStorageSpy.add).toHaveBeenCalledOnceWith(MOCK_PRODUCTS[0]);
    }));

    it('should NOT call CartStorageService.add when product is out of stock', fakeAsync(() => {
      createComponent();
      tick(300);

      access(component).onAddToCart(OUT_OF_STOCK_PRODUCT);

      expect(cartStorageSpy.add).not.toHaveBeenCalled();
    }));
  });

  describe('Limpiar búsqueda', () => {
    it('should reset searchControl to empty string when onClearSearch is called', fakeAsync(() => {
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
