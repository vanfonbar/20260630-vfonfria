import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '@/interfaces/product.interface';

export interface ProductRepositoryContract {
  getAll(): Observable<Product[]>;
  searchByName(query: string): Observable<Product[]>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepositoryContract>('PRODUCT_REPOSITORY');
