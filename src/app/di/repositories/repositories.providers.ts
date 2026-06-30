import { Provider } from '@angular/core';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductRepositoryImpl } from '@/repositories/product.repository.impl';

export const repositoriesProviders: Provider[] = [
  {
    provide: ProductRepository,
    useClass: ProductRepositoryImpl
  }
];
