import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PRODUCT_REPOSITORY, ProductRepositoryContract } from '@/domain/repositories/product.repository.contract';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';
import { ProductsUseCase } from '@/use-cases/products.use-case.contract';

@Injectable()
export class ProductsUseCaseImpl implements ProductsUseCase {
  readonly #repository: ProductRepositoryContract = inject(PRODUCT_REPOSITORY);

  getProducts(): Observable<Product[]> {
    return this.#repository.getAll();
  }

  getProductsByCategory(category: Category): Observable<Product[]> {
    return this.#repository.getByCategory(category);
  }

  searchByName(query: string): Observable<Product[]> {
    return this.#repository.searchByName(query);
  }
}
