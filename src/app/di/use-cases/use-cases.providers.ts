import { Provider } from '@angular/core';

import { ProductsUseCaseImpl } from '@/use-cases/products.use-case';
import { PRODUCTS_USE_CASE } from '@/use-cases/products.use-case.contract';

export const provideUseCases = (): Provider[] => [
  ProductsUseCaseImpl,
  { provide: PRODUCTS_USE_CASE, useExisting: ProductsUseCaseImpl }
];
