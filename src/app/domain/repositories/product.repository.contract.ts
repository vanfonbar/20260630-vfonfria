import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

export interface ProductRepositoryContract {
  getAll(): Observable<Product[]>;
  getByCategory(category: Category): Observable<Product[]>;
  searchByName(query: string): Observable<Product[]>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepositoryContract>('PRODUCT_REPOSITORY');
