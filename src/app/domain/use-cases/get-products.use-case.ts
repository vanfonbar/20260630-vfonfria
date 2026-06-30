import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { Product } from '@/interfaces/product.interface';

@Injectable()
export class GetProductsUseCase {
  private readonly repository = inject(ProductRepository);

  execute(): Observable<Product[]> {
    return this.repository.getAll();
  }
}
