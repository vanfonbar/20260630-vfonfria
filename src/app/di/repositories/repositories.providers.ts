import { Provider } from '@angular/core';

import { PRODUCT_REPOSITORY } from '@/domain/repositories/product.repository.contract';
import { ProductRepositoryImpl } from '@/repositories/product.repository';

export const repositoriesProviders: Provider[] = [
  ProductRepositoryImpl,
  { provide: PRODUCT_REPOSITORY, useExisting: ProductRepositoryImpl }
];
