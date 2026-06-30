import { Category } from '@/enums/category.enum';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: Category;
  readonly imageUrl: string;
  readonly stock: number;
  readonly attributes: Record<string, string>;
}
