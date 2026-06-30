import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environment';

import { MRepository } from '@mercadona/core/utils/repository';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductDto } from '@/dtos/product.dto';
import { Product } from '@/interfaces/product.interface';
import { productListMapper } from '@/mappers/product.mapper';

@Injectable()
export class ProductRepositoryImpl extends MRepository implements ProductRepository {
  constructor() {
    super(environment.apiUrl);
  }

  getAll(): Observable<Product[]> {
    return this.get<ProductDto[]>('/productos').pipe(map(productListMapper));
  }
}
