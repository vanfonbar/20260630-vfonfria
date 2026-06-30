import { Category } from '@/enums/category.enum';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  stock: number;
  attributes: Record<string, string>;
}
