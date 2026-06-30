import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PRODUCT_REPOSITORY, ProductRepository } from '@/domain/repositories/product.repository';
import { Product } from '@/interfaces/product.interface';
import { ProductsUseCase } from '@/use-cases/products.use-case.contract';

@Injectable()
export class ProductsUseCaseImpl implements ProductsUseCase {
  readonly #repository: ProductRepository = inject(PRODUCT_REPOSITORY);

  getProducts(): Observable<Product[]> {
    return this.#repository.getAll();
  }
}
