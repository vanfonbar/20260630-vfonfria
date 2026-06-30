import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '@environment';

import { ProductRepository } from '@/domain/repositories/product.repository';
import { ProductDto } from '@/dtos/product.dto';
import { Product } from '@/interfaces/product.interface';
import { ProductMapper } from '@/mappers/product.mapper';

@Injectable()
export class ProductRepositoryImpl extends ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  override getAll(): Observable<Product[]> {
    return this.http
      .get<ProductDto[]>(`${this.baseUrl}/productos`)
      .pipe(map((dtos) => ProductMapper.fromDtoList(dtos)));
  }

  override getById(id: string): Observable<Product> {
    return this.http.get<ProductDto>(`${this.baseUrl}/productos/${id}`).pipe(map((dto) => ProductMapper.fromDto(dto)));
  }
}
