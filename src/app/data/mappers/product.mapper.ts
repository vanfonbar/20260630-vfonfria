import { ProductDto } from '@/dtos/product.dto';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

export class ProductMapper {
  static fromDto(dto: ProductDto): Product {
    return {
      id: dto.id,
      name: dto.nombre,
      description: dto.descripcion,
      price: dto.precio,
      category: dto.categoria as Category,
      imageUrl: dto.imagen_url,
      stock: dto.stock,
      attributes: dto.atributos ?? {}
    };
  }

  static fromDtoList(dtos: ProductDto[]): Product[] {
    return dtos.map((dto) => ProductMapper.fromDto(dto));
  }
}
