export interface ProductDto {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly precio: number;
  readonly categoria: string;
  readonly imagen_url: string;
  readonly stock: number;
  readonly atributos: Record<string, string>;
}
