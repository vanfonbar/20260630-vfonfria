import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MButtonComponent } from '@mercadona/components/button';
import { MTranslatePipe } from '@mercadona/core/translate';

import { CartItem } from '@/interfaces/cart-item.interface';
import { CartStorageService } from '@/presentation/services/cart-storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink, MButtonComponent, MTranslatePipe]
})
export class CartPageComponent {
  readonly #cartStorage: CartStorageService = inject(CartStorageService);

  protected readonly items: Signal<CartItem[]> = this.#cartStorage.items;
  protected readonly total: Signal<number> = computed<number>((): number =>
    this.items().reduce((sum: number, item: CartItem): number => sum + item.product.price * item.quantity, 0)
  );
  protected readonly itemCount: Signal<number> = computed<number>((): number =>
    this.items().reduce((sum: number, item: CartItem): number => sum + item.quantity, 0)
  );

  protected increaseQuantity(productId: string): void {
    this.#persist(
      this.items().map(
        (item: CartItem): CartItem => (item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item)
      )
    );
  }

  protected decreaseQuantity(productId: string): void {
    this.#persist(
      this.items()
        .map(
          (item: CartItem): CartItem =>
            item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item: CartItem): boolean => item.quantity > 0)
    );
  }

  protected removeItem(productId: string): void {
    this.#persist(this.items().filter((item: CartItem): boolean => item.product.id !== productId));
  }

  #persist(items: CartItem[]): void {
    this.#cartStorage.write(items);
  }
}
