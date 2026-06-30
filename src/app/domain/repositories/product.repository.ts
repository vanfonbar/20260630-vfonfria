import { Observable } from 'rxjs';

import { Product } from '@/interfaces/product.interface';

export abstract class ProductRepository {
  abstract getAll(): Observable<Product[]>;
  abstract getById(id: string): Observable<Product>;
}
