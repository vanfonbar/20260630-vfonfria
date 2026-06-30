import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '@/interfaces/product.interface';

export interface ProductsUseCase {
  getProducts(): Observable<Product[]>;
}

export const PRODUCTS_USE_CASE = new InjectionToken<ProductsUseCase>('PRODUCTS_USE_CASE');
