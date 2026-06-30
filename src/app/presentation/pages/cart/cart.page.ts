import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MButtonComponent } from '@mercadona/components/button';

import { CartItem } from '@/interfaces/cart-item.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, MButtonComponent]
})
export class CartPage implements OnInit {
  readonly items = signal<CartItem[]>([]);

  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0));

  readonly itemCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  ngOnInit(): void {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.items.set(JSON.parse(stored) as CartItem[]);
    }
  }

  increaseQuantity(productId: string): void {
    const updated = this.items().map((item) =>
      item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.persist(updated);
  }

  decreaseQuantity(productId: string): void {
    const updated = this.items()
      .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);
    this.persist(updated);
  }

  removeItem(productId: string): void {
    const updated = this.items().filter((item) => item.product.id !== productId);
    this.persist(updated);
  }

  private persist(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }
}
