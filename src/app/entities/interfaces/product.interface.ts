import { Category } from '@/enums/category.enum';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: any;
  category: Category;
  imageUrl: string;
  stock: any;
  attributes: any;
}
