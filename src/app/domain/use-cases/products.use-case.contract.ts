import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

export interface ProductsUseCase {
  getProducts(): Observable<Product[]>;
  getProductsByCategory(category: Category): Observable<Product[]>;
  searchByName(query: string): Observable<Product[]>;
  invalidateCache(): void;
}

export const PRODUCTS_USE_CASE = new InjectionToken<ProductsUseCase>('PRODUCTS_USE_CASE');
