import { CUSTOM_ELEMENTS_SCHEMA, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { CartPageComponent } from './cart.page';
import { CartStorageService } from '@/presentation/services/cart-storage.service';
import { Category } from '@/enums/category.enum';
import { CartItem } from '@/interfaces/cart-item.interface';
import { Product } from '@/interfaces/product.interface';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PRODUCT_LECHE: Product = {
  id: '1',
  name: 'Leche entera',
  description: '',
  price: 0.89,
  category: Category.DAIRY,
  imageUrl: 'https://example.com/leche.jpg',
  stock: 10,
  attributes: {}
};

const PRODUCT_PAN: Product = {
  id: '2',
  name: 'Pan integral',
  description: '',
  price: 1.35,
  category: Category.BAKERY,
  imageUrl: 'https://example.com/pan.jpg',
  stock: 5,
  attributes: {}
};

// Acceso a miembros privados/protegidos desde tests
const access = (c: CartPageComponent): any => c as any;

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CartPageComponent', () => {
  let fixture: ComponentFixture<CartPageComponent>;
  let component: CartPageComponent;
  let itemsSignal: ReturnType<typeof signal<CartItem[]>>;
  let writeSpy: jasmine.Spy;

  beforeEach(() => {
    itemsSignal = signal<CartItem[]>([]);
    writeSpy = jasmine.createSpy('write').and.callFake((items: CartItem[]) => {
      itemsSignal.set(items);
    });

    TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideMTranslateTesting(),
        {
          provide: CartStorageService,
          useValue: {
            items: itemsSignal.asReadonly(),
            itemCount: computed(() => itemsSignal().reduce((s: number, i: CartItem) => s + i.quantity, 0)),
            write: writeSpy
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  /**
   * @param {CartItem[]} initialItems - Items to preload into the cart signal before creating the component.
   */
  function createComponent(initialItems: CartItem[] = []): void {
    itemsSignal.set(initialItems);
    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  // ─── Inicialización ────────────────────────────────────────────────────────

  describe('Inicialización', () => {
    it('should create the component', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should reflect items from CartStorageService', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 2 }]);

      expect(access(component).items()).toHaveSize(1);
      expect(access(component).items()[0].product.id).toBe('1');
    });

    it('should compute total as sum of price × quantity', () => {
      createComponent([
        { product: PRODUCT_LECHE, quantity: 2 },
        { product: PRODUCT_PAN, quantity: 1 }
      ]);

      // 0.89 × 2 + 1.35 × 1 = 3.13
      expect(access(component).total()).toBeCloseTo(3.13, 2);
    });

    it('should compute itemCount as sum of all quantities', () => {
      createComponent([
        { product: PRODUCT_LECHE, quantity: 3 },
        { product: PRODUCT_PAN, quantity: 2 }
      ]);

      expect(access(component).itemCount()).toBe(5);
    });

    it('should return 0 total when cart is empty', () => {
      createComponent([]);

      expect(access(component).total()).toBe(0);
    });
  });

  // ─── increaseQuantity ──────────────────────────────────────────────────────

  describe('increaseQuantity', () => {
    it('should increment the quantity of the matching product', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);

      access(component).increaseQuantity('1');

      expect(writeSpy).toHaveBeenCalledOnceWith([{ product: PRODUCT_LECHE, quantity: 2 }]);
    });

    it('should not affect other products', () => {
      createComponent([
        { product: PRODUCT_LECHE, quantity: 1 },
        { product: PRODUCT_PAN, quantity: 1 }
      ]);

      access(component).increaseQuantity('1');

      const written: CartItem[] = writeSpy.calls.mostRecent().args[0];
      expect(written.find((i: CartItem) => i.product.id === '2')?.quantity).toBe(1);
    });

    it('should update items signal reactively after increase', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);

      access(component).increaseQuantity('1');
      fixture.detectChanges();

      expect(access(component).items()[0].quantity).toBe(2);
    });
  });

  // ─── decreaseQuantity ──────────────────────────────────────────────────────

  describe('decreaseQuantity', () => {
    it('should decrement the quantity of the matching product', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 3 }]);

      access(component).decreaseQuantity('1');

      expect(writeSpy).toHaveBeenCalledOnceWith([{ product: PRODUCT_LECHE, quantity: 2 }]);
    });

    it('should remove the item when quantity reaches 0', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);

      access(component).decreaseQuantity('1');

      expect(writeSpy).toHaveBeenCalledOnceWith([]);
    });

    it('should not affect other products', () => {
      createComponent([
        { product: PRODUCT_LECHE, quantity: 2 },
        { product: PRODUCT_PAN, quantity: 1 }
      ]);

      access(component).decreaseQuantity('1');

      const written: CartItem[] = writeSpy.calls.mostRecent().args[0];
      expect(written.find((i: CartItem) => i.product.id === '2')?.quantity).toBe(1);
    });
  });

  // ─── removeItem ────────────────────────────────────────────────────────────

  describe('removeItem', () => {
    it('should remove the matching product from the cart', () => {
      createComponent([
        { product: PRODUCT_LECHE, quantity: 2 },
        { product: PRODUCT_PAN, quantity: 1 }
      ]);

      access(component).removeItem('1');

      const written: CartItem[] = writeSpy.calls.mostRecent().args[0];
      expect(written).toHaveSize(1);
      expect(written[0].product.id).toBe('2');
    });

    it('should result in an empty cart when the last item is removed', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);

      access(component).removeItem('1');

      expect(writeSpy).toHaveBeenCalledOnceWith([]);
    });

    it('should not modify the cart when product id does not match', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);

      access(component).removeItem('non-existent');

      const written: CartItem[] = writeSpy.calls.mostRecent().args[0];
      expect(written).toHaveSize(1);
    });
  });

  // ─── Señales reactivas ─────────────────────────────────────────────────────

  describe('Reactividad', () => {
    it('should update total when items signal changes externally', () => {
      createComponent([{ product: PRODUCT_LECHE, quantity: 1 }]);
      expect(access(component).total()).toBeCloseTo(0.89, 2);

      itemsSignal.set([
        { product: PRODUCT_LECHE, quantity: 1 },
        { product: PRODUCT_PAN, quantity: 2 }
      ]);
      fixture.detectChanges();

      expect(access(component).total()).toBeCloseTo(0.89 + 1.35 * 2, 2);
    });

    it('should update itemCount when items signal changes externally', () => {
      createComponent([]);
      expect(access(component).itemCount()).toBe(0);

      itemsSignal.set([{ product: PRODUCT_LECHE, quantity: 3 }]);
      fixture.detectChanges();

      expect(access(component).itemCount()).toBe(3);
    });
  });
});
