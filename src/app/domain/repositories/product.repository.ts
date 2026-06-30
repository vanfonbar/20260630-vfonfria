import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '@/interfaces/product.interface';

export interface ProductRepository {
  getAll(): Observable<Product[]>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('PRODUCT_REPOSITORY');
