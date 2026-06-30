import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';

import { MTranslatePipe } from '@mercadona/core/translate';

import { Product } from '@/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, NgOptimizedImage, MTranslatePipe]
})
export class ProductCardComponent {
  readonly product: InputSignal<Product> = input.required<Product>();
  readonly addToCart: OutputEmitterRef<Product> = output<Product>();

  protected onAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
