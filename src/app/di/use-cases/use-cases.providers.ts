import { Provider } from '@angular/core';

import { GetProductsUseCase } from '@/use-cases/get-products.use-case';

export const useCasesProviders: Provider[] = [GetProductsUseCase];
