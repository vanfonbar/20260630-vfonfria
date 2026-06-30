import { MapFromFn } from '@mercadona/common/public';

import { ProductDto } from '@/dtos/product.dto';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

const VALID_CATEGORIES = new Set<string>(Object.values(Category));

const isValidCategory = (value: string): value is Category => VALID_CATEGORIES.has(value);

export const productMapper: MapFromFn<ProductDto, Product> = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.nombre,
  description: dto.descripcion,
  price: dto.precio,
  category: isValidCategory(dto.categoria) ? dto.categoria : Category.FRESH,
  imageUrl: dto.imagen_url,
  stock: dto.stock,
  attributes: dto.atributos
});

export const productListMapper: MapFromFn<ProductDto[], Product[]> = (dtos: ProductDto[]): Product[] =>
  dtos.map(productMapper);
