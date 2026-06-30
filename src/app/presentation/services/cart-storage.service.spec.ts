import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CartStorageService } from './cart-storage.service';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

const PRODUCT_A: Product = {
  id: 'a',
  name: 'Leche entera',
  description: '',
  price: 0.89,
  category: Category.DAIRY,
  imageUrl: '',
  stock: 10,
  attributes: {}
};

const PRODUCT_B: Product = {
  id: 'b',
  name: 'Pan integral',
  description: '',
  price: 1.35,
  category: Category.BAKERY,
  imageUrl: '',
  stock: 5,
  attributes: {}
};

describe('CartStorageService', () => {
  let service: CartStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), CartStorageService]
    });
    service = TestBed.inject(CartStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── itemCount ────────────────────────────────────────────────────────────────

  describe('itemCount', () => {
    it('should return 0 when the cart is empty', () => {
      expect(service.itemCount()).toBe(0);
    });

    it('should return the quantity after adding one product', () => {
      service.add(PRODUCT_A);

      expect(service.itemCount()).toBe(1);
    });

    it('should increment when the same product is added again', () => {
      service.add(PRODUCT_A);
      service.add(PRODUCT_A);

      expect(service.itemCount()).toBe(2);
    });

    it('should sum quantities across different products', () => {
      service.add(PRODUCT_A);
      service.add(PRODUCT_A);
      service.add(PRODUCT_B);

      expect(service.itemCount()).toBe(3);
    });

    it('should update to 0 after write([]) clears the cart', () => {
      service.add(PRODUCT_A);
      service.add(PRODUCT_B);

      service.write([]);

      expect(service.itemCount()).toBe(0);
    });

    it('should reflect the total quantity written directly via write()', () => {
      service.write([
        { product: PRODUCT_A, quantity: 3 },
        { product: PRODUCT_B, quantity: 2 }
      ]);

      expect(service.itemCount()).toBe(5);
    });
  });

  // ─── read / write ─────────────────────────────────────────────────────────────

  describe('read', () => {
    it('should return empty array when localStorage is empty', () => {
      expect(service.read()).toEqual([]);
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('cart', 'not-json');

      expect(service.read()).toEqual([]);
    });
  });

  describe('write', () => {
    it('should persist items to localStorage', () => {
      service.write([{ product: PRODUCT_A, quantity: 2 }]);

      const stored = JSON.parse(localStorage.getItem('cart')!);
      expect(stored[0].product.id).toBe('a');
      expect(stored[0].quantity).toBe(2);
    });
  });

  // ─── add ──────────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('should add a new product with quantity 1', () => {
      service.add(PRODUCT_A);

      expect(service.read()).toHaveSize(1);
      expect(service.read()[0].quantity).toBe(1);
    });

    it('should increment quantity when the same product is added twice', () => {
      service.add(PRODUCT_A);
      service.add(PRODUCT_A);

      expect(service.read()).toHaveSize(1);
      expect(service.read()[0].quantity).toBe(2);
    });

    it('should add a separate entry for a different product', () => {
      service.add(PRODUCT_A);
      service.add(PRODUCT_B);

      expect(service.read()).toHaveSize(2);
    });
  });
});
