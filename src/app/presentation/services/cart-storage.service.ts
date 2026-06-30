import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { CartItem } from '@/interfaces/cart-item.interface';
import { Product } from '@/interfaces/product.interface';

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartStorageService {
  readonly #items: WritableSignal<CartItem[]> = signal<CartItem[]>(this.read());

  readonly items: Signal<CartItem[]> = this.#items.asReadonly();

  readonly itemCount: Signal<number> = computed<number>(() =>
    this.#items().reduce((sum: number, item: CartItem): number => sum + item.quantity, 0)
  );

  read(): CartItem[] {
    try {
      const raw: string | null = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  write(items: CartItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this.#items.set(items);
  }

  /**
   * Adds a product to the cart. Increments quantity if it already exists.
   *
   * @param {Product} product - The product to add to the cart.
   */
  add(product: Product): void {
    const current: CartItem[] = this.#items();
    const exists: boolean = current.some((item: CartItem): boolean => item.product.id === product.id);
    const updated: CartItem[] = exists
      ? current.map(
          (item: CartItem): CartItem =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...current, { product, quantity: 1 }];
    this.write(updated);
  }
}
