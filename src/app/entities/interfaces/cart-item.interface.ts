import { Product } from './product.interface';

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}
