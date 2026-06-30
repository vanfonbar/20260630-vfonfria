import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environment';

import { MRepository } from '@mercadona/core/utils/repository';

import { ProductRepositoryContract } from '@/domain/repositories/product.repository.contract';
import { ProductDto } from '@/dtos/product.dto';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';
import { productListMapper } from '@/mappers/product.mapper';

@Injectable()
export class ProductRepositoryImpl extends MRepository implements ProductRepositoryContract {
  constructor() {
    super(environment.apiUrl);
  }

  getAll(): Observable<Product[]> {
    return this.get<ProductDto[]>('/productos').pipe(map(productListMapper));
  }

  getByCategory(category: Category): Observable<Product[]> {
    return this.get<ProductDto[]>('/productos').pipe(
      map(productListMapper),
      map((products: Product[]): Product[] =>
        products.filter((product: Product): boolean => product.category === category)
      )
    );
  }

  searchByName(query: string): Observable<Product[]> {
    const lowerQuery: string = query.toLowerCase();
    return this.get<ProductDto[]>('/productos').pipe(
      map(productListMapper),
      map((products: Product[]): Product[] =>
        products.filter((product: Product): boolean => product.name.toLowerCase().includes(lowerQuery))
      )
    );
  }
}
