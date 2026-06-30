import { Injectable } from '@angular/core';

import { CartItem } from '@/interfaces/cart-item.interface';
import { Product } from '@/interfaces/product.interface';

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartStorageService {
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
  }

  add(product: Product): void {
    const items: CartItem[] = this.read();
    const existing: CartItem | undefined = items.find((item: CartItem): boolean => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.push({ product, quantity: 1 });
    }
    this.write(items);
  }
}
