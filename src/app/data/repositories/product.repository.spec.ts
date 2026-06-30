import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { environment } from '@environment';

import { ProductRepositoryImpl } from './product.repository';
import { ProductDto } from '@/dtos/product.dto';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

const MOCK_DTOS: ProductDto[] = [
  {
    id: '1',
    nombre: 'Leche entera Hacendado 1L',
    descripcion: 'Leche de vaca',
    precio: 0.89,
    categoria: 'lacteos',
    imagen_url: 'https://example.com/leche.jpg',
    stock: 150,
    atributos: {}
  },
  {
    id: '2',
    nombre: 'Pan de molde integral Hacendado',
    descripcion: 'Pan integral',
    precio: 1.35,
    categoria: 'panaderia',
    imagen_url: 'https://example.com/pan.jpg',
    stock: 80,
    atributos: {}
  },
  {
    id: '3',
    nombre: 'Pechuga de pollo',
    descripcion: 'Pollo fresco',
    precio: 5.49,
    categoria: 'carniceria',
    imagen_url: 'https://example.com/pollo.jpg',
    stock: 40,
    atributos: {}
  }
];

describe('ProductRepositoryImpl', () => {
  let repository: ProductRepositoryImpl;
  let httpTesting: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductRepositoryImpl
      ]
    });

    repository = TestBed.inject(ProductRepositoryImpl);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getAll', () => {
    it('should return all products mapped from DTOs', () => {
      let result: Product[] | undefined;

      repository.getAll().subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(3);
      expect(result![0].name).toBe('Leche entera Hacendado 1L');
      expect(result![0].category).toBe(Category.DAIRY);
    });
  });

  describe('Caché', () => {
    it('should not make a second HTTP request when getAll() is called twice', () => {
      let first: Product[] | undefined;
      let second: Product[] | undefined;

      repository.getAll().subscribe((p) => (first = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.getAll().subscribe((p) => (second = p));
      httpTesting.expectNone(`${baseUrl}/productos`);

      expect(second).toEqual(first);
    });

    it('should not make a second HTTP request when getByCategory() is called twice with the same category', () => {
      let first: Product[] | undefined;
      let second: Product[] | undefined;

      repository.getByCategory(Category.DAIRY).subscribe((p) => (first = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.getByCategory(Category.DAIRY).subscribe((p) => (second = p));
      httpTesting.expectNone(`${baseUrl}/productos`);

      expect(second).toEqual(first);
    });

    it('should make independent HTTP requests for getAll() and getByCategory() (different cache keys)', () => {
      let allResult: Product[] | undefined;
      let categoryResult: Product[] | undefined;

      repository.getAll().subscribe((p) => (allResult = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.getByCategory(Category.DAIRY).subscribe((p) => (categoryResult = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      expect(allResult).toHaveSize(3);
      expect(categoryResult).toHaveSize(1);
    });

    it('should make independent HTTP requests for different categories (different cache keys)', () => {
      repository.getByCategory(Category.DAIRY).subscribe();
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      let result: Product[] | undefined;
      repository.getByCategory(Category.BUTCHER).subscribe((p) => (result = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
      expect(result![0].id).toBe('3');
    });

    it('should make a new HTTP request for getAll() after clearCache()', () => {
      let result: Product[] | undefined;

      repository.getAll().subscribe();
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.clearCache();

      repository.getAll().subscribe((p) => (result = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      expect(result).toHaveSize(3);
    });

    it('should make a new HTTP request for getByCategory() after clearCache()', () => {
      let result: Product[] | undefined;

      repository.getByCategory(Category.DAIRY).subscribe();
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.clearCache();

      repository.getByCategory(Category.DAIRY).subscribe((p) => (result = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
    });

    it('should clear all method caches when clearCache() is called', () => {
      let getAllResult: Product[] | undefined;
      let getByCategoryResult: Product[] | undefined;

      repository.getAll().subscribe();
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);
      repository.getByCategory(Category.DAIRY).subscribe();
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      repository.clearCache();

      repository.getAll().subscribe((p) => (getAllResult = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);
      repository.getByCategory(Category.DAIRY).subscribe((p) => (getByCategoryResult = p));
      httpTesting.expectOne(`${baseUrl}/productos`).flush(MOCK_DTOS);

      expect(getAllResult).toHaveSize(3);
      expect(getByCategoryResult).toHaveSize(1);
    });
  });

  describe('getByCategory', () => {
    it('should return only products that belong to the given category', () => {
      let result: Product[] | undefined;

      repository.getByCategory(Category.DAIRY).subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
      expect(result![0].id).toBe('1');
      expect(result![0].category).toBe(Category.DAIRY);
    });

    it('should return empty array when no products belong to the given category', () => {
      let result: Product[] | undefined;

      repository.getByCategory(Category.FRESH).subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toEqual([]);
    });

    it('should return multiple products when several belong to the given category', () => {
      const multiDairy: ProductDto[] = [
        ...MOCK_DTOS,
        {
          id: '4',
          nombre: 'Yogur natural',
          descripcion: 'Yogur de vaca',
          precio: 1.2,
          categoria: 'lacteos',
          imagen_url: 'https://example.com/yogur.jpg',
          stock: 60,
          atributos: {}
        }
      ];
      let result: Product[] | undefined;

      repository.getByCategory(Category.DAIRY).subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(multiDairy);

      expect(result).toHaveSize(2);
      result!.forEach((p) => expect(p.category).toBe(Category.DAIRY));
    });

    it('should not be affected by category values of other products', () => {
      let result: Product[] | undefined;

      repository.getByCategory(Category.BUTCHER).subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
      expect(result![0].id).toBe('3');
    });

    it('should map DTOs to Product entities correctly', () => {
      let result: Product[] | undefined;

      repository.getByCategory(Category.DAIRY).subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result![0].name).toBe('Leche entera Hacendado 1L');
      expect(result![0].price).toBe(0.89);
      expect(result![0].stock).toBe(150);
    });
  });

  describe('searchByName', () => {
    it('should return products whose name contains the query (case-insensitive)', () => {
      let result: Product[] | undefined;

      repository.searchByName('pan').subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
      expect(result![0].name).toBe('Pan de molde integral Hacendado');
    });

    it('should match regardless of case', () => {
      let result: Product[] | undefined;

      repository.searchByName('LECHE').subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(1);
      expect(result![0].id).toBe('1');
    });

    it('should return empty array when no products match the query', () => {
      let result: Product[] | undefined;

      repository.searchByName('xyzinexistente').subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toEqual([]);
    });

    it('should return multiple products when query matches several names', () => {
      let result: Product[] | undefined;

      repository.searchByName('hacendado').subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(MOCK_DTOS);

      expect(result).toHaveSize(2);
    });

    it('should return all products when query matches all names', () => {
      const allMatchDtos: ProductDto[] = MOCK_DTOS.map((dto) => ({ ...dto, nombre: `${dto.nombre} especial` }));
      let result: Product[] | undefined;

      repository.searchByName('especial').subscribe((products) => (result = products));

      const req = httpTesting.expectOne(`${baseUrl}/productos`);
      req.flush(allMatchDtos);

      expect(result).toHaveSize(3);
    });
  });
});
