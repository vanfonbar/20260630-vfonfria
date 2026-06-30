export interface ProductDto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  stock: number;
  atributos: Record<string, string>;
}
