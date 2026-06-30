# Análisis del repositorio — Gestor de Pedidos

> Revisión sobre el commit `1fddcb2` · Angular 21.2.9 · Fecha: 2026-06-30
> Iterado con `/mr-review` el 2026-06-30
> Iterado con `/emplea2-review` el 2026-06-30
> Iterado manualmente el 2026-06-30

---

## Índice

1. [Problemas encontrados](#1-problemas-encontrados)
   - [Bugs](#11-bugs)
   - [Deuda técnica](#12-deuda-técnica)
   - [Malas prácticas](#13-malas-prácticas)
   - [Seguridad](#14-seguridad)
   - [Accesibilidad](#15-accesibilidad)
   - [Rendimiento](#16-rendimiento)
   - [Tests](#17-tests)
2. [Propuesta de mejoras](#2-propuesta-de-mejoras)
3. [Lo que está bien](#3-lo-que-está-bien)

---

## 1. Problemas encontrados

### 1.1 Bugs

| #   | Severidad | Archivo                 | Descripción                                                                                                                                                                                                                                                                         |
| --- | --------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Alta**  | `catalog.page.ts:36`    | La suscripción a `getProductsUseCase.execute()` no tiene callback de error. Si la API falla, el usuario no recibe ningún feedback y la pantalla queda vacía sin explicación.                                                                                                        |
| B2  | **Alta**  | `cart.page.ts:19`       | `item.product.price * item.quantity` opera sobre `price: any`. Si la API devuelve el precio como string (e.g. `"1.50"`), JavaScript producirá concatenación en lugar de multiplicación, generando totales incorrectos sin ningún error visible. Se corrige tipando `price: number`. |
| B3  | **Media** | `catalog.page.ts:23–33` | `onAddToCart()` no comprueba stock antes de añadir. Un producto con `stock: 0` puede añadirse igualmente al carrito si el usuario manipula el estado.                                                                                                                               |
| B4  | **Media** | `cart.page.ts:25–26`    | `JSON.parse(stored) as CartItem[]` no está protegido con try-catch. Si `localStorage` contiene JSON malformado, la aplicación lanza una excepción no controlada y deja de funcionar.                                                                                                |
| B5  | **Media** | `catalog.page.ts:25`    | `JSON.parse(raw)` en `onAddToCart()` tampoco tiene try-catch. Mismo riesgo que B4.                                                                                                                                                                                                  |
| B6  | **Media** | `catalog.page.ts:36–41` | La suscripción creada en el constructor no se cancela nunca. Si el usuario navega a otra ruta y vuelve, se acumulan suscripciones activas (memory leak).                                                                                                                            |

---

### 1.2 Deuda técnica

| #   | Severidad | Archivo                                                                                     | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | --------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **Alta**  | `data/dtos/product.dto.ts:5–9`                                                              | Cuatro campos (`precio`, `categoria`, `stock`, `atributos`) tipados como `any`. Incumple `@typescript-eslint/no-explicit-any` y anula la seguridad de tipos en la capa de datos.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| D2  | **Alta**  | `entities/interfaces/product.interface.ts:7,10–11`                                          | Los campos `price`, `stock` y `attributes` de la entidad principal son `any`. Si el dominio no tiene tipos, el sistema entero carece de garantías.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D3  | **Alta**  | `app.component.spec.ts`                                                                     | El único test funcional falla en CI con `NG0201: No provider found for 'ActivatedRoute'`. Le falta `provideRouter([])` en el `TestBed`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| D4  | **Media** | `catalog.page.ts`, `cart.page.ts`                                                           | El acceso a `localStorage` está duplicado y disperso en los componentes. No existe abstracción (servicio o token) que centralice el almacenamiento local.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| D5  | **Media** | `catalog.page.ts:14`, `cart.page.ts:16`                                                     | Las clases se llaman `CatalogPage` y `CartPage`. La regla ESLint del proyecto exige el sufijo `Component`. Genera 2 errores de linting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| D6  | **Media** | `data/mappers/product.mapper.ts`                                                            | El cast `as Category` es inseguro: si la API devuelve una cadena fuera del enum, la app asigna un valor inválido sin advertir.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D12 | **Alta**  | `domain/use-cases/`                                                                         | Falta el archivo de contrato del caso de uso (`get-products.use-case.contract.ts`). La arquitectura clean recomienda separar contrato e implementación: el contrato define una `interface` con el método de dominio y exporta un `InjectionToken`, mientras que la implementación lo inyecta a través de ese token. Sin contrato, la presentación inyecta directamente la clase concreta (`GetProductsUseCase`), acoplando la capa de UI a la implementación y haciendo imposible sustituirla o mockearla sin modificar los componentes. El nombre del método `execute()` también debe reemplazarse por uno con semántica de dominio (`getProducts()`). El contrato correcto sería: `export interface IGetProductsUseCase { getProducts(): Observable<ProductModel[]>; }` + `export const GET_PRODUCTS_USE_CASE = new InjectionToken<IGetProductsUseCase>('GET_PRODUCTS_USE_CASE')`. |
| D11 | **Media** | `domain/repositories/product.repository.ts`                                                 | El contrato del repositorio se define como `abstract class` en lugar de `InjectionToken + interface`. Aunque funciona en Angular (la clase abstracta tiene identidad en runtime y puede usarse como token de DI), viola el principio: Clean Architecture pura requiere que el dominio sea independiente de cualquier constructo que exista en runtime — una `interface` TypeScript es un contrato puro que desaparece al compilar, mientras que una `class` (aunque abstracta) persiste. Adicionalmente, los métodos retornan `Observable<Product[]>`, lo que introduce una dependencia de RxJS en la capa de dominio.                                                                                                                                                                                                                                                               |
| D10 | **Baja**  | `data/repositories/product.repository.impl.ts`                                              | El sufijo `.impl.ts` es redundante. La distinción entre contrato e implementación ya la expresa la capa: `domain/repositories/` contiene contratos y `data/repositories/` contiene implementaciones. Renombrar a `product.repository.ts` dentro de `data/repositories/` es suficiente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D9  | **Baja**  | `data/mappers/product.mapper.ts:15`                                                         | `attributes: dto.atributos ?? {}` introduce un fallback que contradice el contrato del DTO: si `atributos` es un campo obligatorio (sin `?`), el operador `??` implica que puede ser `undefined`, lo cual es mentira. O se elimina el fallback (confiando en el contrato) o se declara `atributos?` en el DTO para reflejar que la API puede omitirlo. El DTO siempre debe coincidir exactamente con lo que devuelve el Swagger.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| D8  | **Media** | `data/mappers/product.mapper.ts`                                                            | El mapper usa una clase con métodos `static` (`ProductMapper.fromDto`, `ProductMapper.fromDtoList`). Una clase con solo métodos estáticos es un namespace disfrazado: no puede ser mockeada por referencia en tests. La convención exige funciones exportadas individualmente tipadas con `MapFromFn`, lo que garantiza una firma estándar en todo el proyecto y mejora la testeabilidad.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| D7  | **Baja**  | `public/assets/i18n/es.json`                                                                | El archivo de traducciones está vacío (`{}`). El módulo de i18n está configurado pero no se usa en ningún template.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| D13 | **Media** | `domain/use-cases/get-products.use-case.ts`                                                 | El nombre del archivo incluye el prefijo `get-`, que es un verbo CRUD. El nombre de un caso de uso debe identificar el concepto de dominio, no la acción técnica. El verbo ya está implícito en que es un caso de uso.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D14 | **Media** | `domain/repositories/product.repository.ts`, `data/repositories/product.repository.impl.ts` | El método `getById(id: string)` está definido en el contrato del repositorio e implementado en `ProductRepositoryImpl`, pero **no se llama en ningún punto del código** — es código muerto. Mantenerlo obliga a que cualquier implementación futura del repositorio lo implemente aunque no lo necesite, añade superficie de test sin retorno y genera confusión sobre si el método está pendiente de uso o es un vestigio. Si no hay un caso de uso que lo consuma, debe eliminarse hasta que se necesite.                                                                                                                                                                                                                                                                                                                                                                          |
| D15 | **Media** | todos los archivos `.ts`                                                                    | Faltan anotaciones de tipo explícitas en variables locales a lo largo del proyecto. TypeScript infiere correctamente la mayoría de los tipos, pero la ausencia de anotaciones explícitas dificulta la lectura y puede enmascarar errores en refactorizaciones. Ejemplos concretos: `const raw = localStorage.getItem('cart')` (infiere `string \| null` pero no está declarado), `const existing = cart.find(...)` (infiere `CartItem \| undefined` pero no está anotado), y los `computed()` sin generic explícito como `computed<number>()`. Con `strict: true` activado el compilador ayuda, pero las anotaciones explícitas en puntos clave son la primera línea de documentación del código.                                                                                                                                                                                    |

---

### 1.3 Malas prácticas

| #   | Severidad | Archivo                           | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | --------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | **Media** | `catalog.page.ts:19–21`           | El constructor llama a `loadProducts()`, que dispara una suscripción asíncrona. Los constructores deben limitarse a inyectar dependencias; la lógica de inicialización corresponde a `ngOnInit()` o a un `effect()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| P2  | **Media** | `catalog.page.ts:24`              | El tipo del carrito se define inline (`{ product: Product; quantity: number }[]`) en lugar de reutilizar la interfaz `CartItem` que ya existe en `entities/`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| P3  | **Media** | `catalog.page.ts`                 | Los productos se cargan con `subscribe()` manual y se almacenan en un `signal`. El patrón recomendado con Signals es usar `toSignal()` del paquete `rxjs-interop`, que gestiona la suscripción automáticamente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| P7  | **Media** | `app.routes.ts:12,16,20`          | Los paths de las rutas están definidos en español: `'catalogo'` y `'carrito'`. Hay tres motivos concretos: (1) **Consistencia con el código** — el resto del proyecto usa inglés en selectores, variables y nombres de archivo; mezclar español en las URLs rompe esa coherencia. (2) **Mantenibilidad** — cuando un desarrollador no hispanohablante lee el código, las URLs en español añaden fricción innecesaria; `'catalog'` y `'cart'` son autoexplicativas en cualquier equipo. (3) **Confusión entre dominio técnico y UX** — el texto que ve el usuario (e.g. el breadcrumb, los enlaces de la nav) se gestiona con i18n; la ruta es una dirección técnica interna y debe seguir las convenciones del código, no las del idioma del producto. El fix es directo: cambiar `'catalogo'` → `'catalog'` y `'carrito'` → `'cart'` en `app.routes.ts`, y actualizar los `routerLink` en `app.component.html` y en `cart.page.html` donde apunta de vuelta al catálogo. |
| P4  | **Media** | `entities/enums/category.enum.ts` | Las claves del enum están en español (`FRESCOS`, `LACTEOS`, `CARNICERIA`…). Los valores del enum (`'frescos'`, `'lacteos'`…) pueden permanecer en español si son los strings exactos que devuelve la API y deben coincidir con el Swagger, pero las claves son identificadores TypeScript y deben ser en inglés: `FRESH`, `DAIRY`, `BUTCHER`, `FISHMONGER`, `BAKERY`, `BEVERAGES`, `FROZEN`, `CLEANING`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| P5  | **Media** | `data/dtos/product.dto.ts`        | Los nombres de los campos del DTO están en español (`precio`, `nombre`, `descripcion`, `imagen_url`, `atributos`, `categoria`) porque replican los nombres de la API. La solución es que el DTO use nombres en inglés con decoradores de serialización (por ejemplo `@Expose({ name: 'precio' })` de `class-transformer`) o que el mapper asuma la responsabilidad de la traducción de nombres — que ya hace. Si el proyecto no usa `class-transformer`, este punto puede documentarse como deuda asumida y justificada por la fidelidad al contrato Swagger.                                                                                                                                                                                                                                                                                                                                                                                                             |
| P6  | **Alta**  | `*.scss`                          | Los estilos **no siguen BEM**. BEM exige el patrón `bloque__elemento--modificador` con `__` para elementos y `--` para modificadores. En el código actual todas las clases de elemento omiten la referencia al bloque: `.product-image` debería ser `.product-card__image`, `.product-info` → `.product-card__info`, `.cart-header` → `.cart-page__header`, `.cart-title` → `.cart-page__title`, `.btn-add-cart` → `.product-card__add-to-cart`, etc. La única excepción parcialmente correcta es `.out-of-stock` y `.disabled`, que actúan como modificadores pero sin el bloque y elemento de referencia. Sin BEM, los estilos de distintos componentes pueden colisionar si comparten nombres genéricos, y es imposible saber qué bloque "posee" cada clase sin leer el HTML.                                                                                                                                                                                          |

---

### 1.4 Seguridad

| #   | Severidad | Archivo                                 | Descripción                                                                                                                                                                                                                 |
| --- | --------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | **Media** | `catalog.page.ts:25`, `cart.page.ts:26` | `JSON.parse()` sin try-catch. Un contenido inesperado en `localStorage` (introducido, por ejemplo, por otro script o extensión) provoca una excepción no capturada que rompe la sesión del usuario.                         |
| S2  | **Baja**  | `catalog.page.ts`, `cart.page.ts`       | El carrito completo se persiste en `localStorage`, accesible a cualquier script de la página. En un e-commerce real, los datos sensibles del pedido deberían mantenerse en el servidor o, como mínimo, en `sessionStorage`. |

---

### 1.5 Accesibilidad

| #   | Severidad | Archivo                          | Descripción                                                                                                                                                                                                                                        |
| --- | --------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | **Alta**  | `product-card.component.html:22` | El botón "Añadir al carrito" está implementado como `<div class="btn-add-cart">`. No es focalizable por teclado, no dispara con Enter/Space y los lectores de pantalla no lo anuncian como control interactivo. Debe ser `<button type="button">`. |
| A2  | **Alta**  | `product-card.component.html:2`  | La imagen del producto no tiene atributo `alt` en absoluto (`<img [src]="product().imageUrl" />`). Viola WCAG 2.1 nivel A. **Fix:** `[alt]="product().name"`.                                                                                      |
| A3  | **Baja**  | Páginas globales                 | No hay un `<h1>` de nivel de página coherente. Cada página define su propio encabezado pero sin una jerarquía global, lo que dificulta la navegación con lectores de pantalla.                                                                     |

---

### 1.6 Rendimiento

| #   | Severidad | Archivo                       | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | --------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Media** | `catalog.page.ts`             | Todos los productos se cargan y renderizan de una vez. Sin paginación ni scroll virtual, un catálogo de cientos de productos saturará el DOM y degradará la experiencia.                                                                                                                                                                                                                                                                                                                                        |
| R2  | **Baja**  | `catalog.page.html`           | El `@for` usa `track $index` en lugar de `track product.id`. Trackear por índice impide que Angular reutilice nodos DOM cuando el orden cambia, forzando re-renders innecesarios.                                                                                                                                                                                                                                                                                                                               |
| R3  | **Baja**  | `product-card.component.html` | El signal `product()` se invoca **8 veces** en el template (líneas 2, 5, 6, 7, 11, 14, 15, 22). Aunque Angular cachea el valor del signal entre lecturas del mismo ciclo de detección, invocar la función repetidamente añade ruido visual y dificulta la lectura. Angular 18+ introduce `@let` para variables locales en template: `@let p = product();`. A partir de ahí, todas las referencias pueden usar `p.name`, `p.price`, etc., dejando claro que se trabaja con un snapshot estable del mismo objeto. |
| R4  | **Baja**  | `cart.page.html:62,66`        | El signal computado `total()` se llama **dos veces** en el mismo template (una en el subtotal y otra en el total). Al ser un `computed()`, el valor ya está memoizado y no se recalcula, pero la duplicación es redundante y puede generar confusión sobre si ambas llamadas devuelven lo mismo. Usar `@let cartTotal = total();` al inicio del bloque `@else` unifica la referencia y hace explícito que el valor es el mismo.                                                                                 |

---

### 1.7 Tests

| #   | Severidad | Descripción                                                                                                                                                                                                                    |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T1  | **Alta**  | El test `app.component.spec.ts` falla en cada ejecución (ver D3). El pipeline de CI reportará build roto.                                                                                                                      |
| T2  | **Alta**  | Cobertura prácticamente nula: no existen specs para `CatalogPage`, `CartPage`, `ProductCardComponent`, `ProductRepositoryImpl`, `ProductMapper` ni `GetProductsUseCase`. La lógica más crítica (carrito) no tiene ningún test. |

---

## 2. Propuesta de mejoras

Las mejoras se ordenan de mayor a menor impacto inmediato.

### Prioridad 1 — Crítico (resolver antes de cualquier despliegue)

**2.1 Corregir el test roto**
Añadir `provideRouter([])` al `TestBed` de `app.component.spec.ts`. Sin esto, CI falla en cada push y el resto de tests deja de ejecutarse.

**2.2 Tipar correctamente las entidades y DTOs**
Reemplazar todos los `any` por tipos concretos:

```typescript
// product.interface.ts
price: number;
stock: number;
attributes: Record<string, string | number>;

// product.dto.ts
precio: number;
categoria: string;
stock: number;
atributos: Record<string, string | number>;
```

Esto activará la detección de errores en compilación y reducirá bugs en runtime.

**2.3 Añadir manejo de errores en la carga de productos**

```typescript
this.getProductsUseCase.execute().subscribe({
  next: (products) => this.products.set(products),
  error: (err) => {
    console.error(err);
    this.errorMessage.set('No se pudieron cargar los productos.');
  }
});
```

**2.4 Proteger JSON.parse con try-catch (en ambos componentes)**

Tanto `onAddToCart()` en `CatalogPage` como `ngOnInit()` en `CartPage` usan `JSON.parse` sin protección:

```typescript
private loadCartFromStorage(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('cart') ?? '[]');
  } catch {
    return [];
  }
}
```

---

### Prioridad 2 — Importante (sprint siguiente)

**2.5 Corregir accesibilidad en `product-card.component.html`**
Dos cambios en el mismo archivo:

1. Añadir `[alt]="product().name"` a la imagen (violación WCAG nivel A).
2. Reemplazar el `<div>` por un `<button type="button">` semántico.

```html
<img class="product-image" [src]="product().imageUrl" [alt]="product().name" />
<!-- ... -->
<button type="button" class="btn-add-cart" [disabled]="product().stock === 0" (click)="onAddToCart()">
  Añadir al carrito
</button>
```

**2.6 Extraer localStorage a un servicio**
Crear `CartStorageService` que encapsule lectura/escritura del carrito. Beneficios: testeable, fácil de cambiar de backend, sin duplicación.

**2.7 Migrar suscripción a `toSignal()`**

```typescript
// En lugar de subscribe() manual:
readonly products = toSignal(this.getProductsUseCase.execute(), { initialValue: [] });
```

Elimina el constructor con efectos secundarios, el memory leak y la necesidad de `OnDestroy`.

**2.8 Renombrar `CartPage` → `CartPageComponent` y `CatalogPage` → `CatalogPageComponent`**
Corrige los 2 errores de linting activos y hace que el código sea coherente con las reglas del proyecto.

**2.9 Validar stock antes de añadir al carrito**

```typescript
onAddToCart(product: Product): void {
  if (product.stock <= 0) return;
  // resto de la lógica
}
```

---

### Prioridad 3 — Mejora de calidad (backlog)

**2.10 Añadir tests unitarios para la lógica de negocio**
Orden de prioridad:

1. `GetProductsUseCase` — lógica central del dominio
2. `ProductMapper` — transformación de datos crítica
3. `CartPage` — lógica del carrito (añadir, eliminar, calcular total)
4. `CatalogPage` — carga de productos y manejo de errores

**2.11 Cambiar `track $index` por `track product.id`**

```html
@for (product of products(); track product.id) { ... }
```

**2.12 Añadir paginación o scroll virtual al catálogo**
Para catálogos grandes, implementar paginación del lado servidor o `@angular/cdk/scrolling` (`VirtualScrollViewport`).

**2.13 Completar las traducciones i18n o eliminar la dependencia**
Si no se va a internacionalizar la aplicación, eliminar `ngx-translate` reduce el bundle. Si sí se va a usar, poblar `es.json` con todas las cadenas visibles.

**2.14 Añadir validación en el mapper**

```typescript
if (!Object.values(Category).includes(dto.categoria as Category)) {
  throw new Error(`Categoría desconocida: ${dto.categoria}`);
}
```

**2.15 Internacionalizar todos los textos visibles**
`provideMTranslate` ya está configurado pero `es.json` está vacío y ningún template usa `| mTranslate`. Hay que extraer todas las cadenas y activar el pipe:

```html
<!-- catalog.page.html -->
<h1>{{ 'PRESENTATION.PAGE.CATALOG.TITLE' | mTranslate }}</h1>

<!-- product-card.component.html -->
<button type="button" ...>{{ 'PRESENTATION.COMPONENT.PRODUCT_CARD.ADD_TO_CART' | mTranslate }}</button>
```

**2.16 Refactorizar entidades de `interface` a `class` con patrón canónico**

```typescript
export class ProductModel {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  category!: Category;
  imageUrl!: string;
  stock!: number;
  attributes!: Record<string, string | number>;

  constructor(entity: ProductModel) {
    Object.assign(this, entity);
  }
}
```

**2.17 Refactorizar repositorio de dominio a `InjectionToken + interface`**

```typescript
// product.repository.contract.ts
export interface IProductRepository {
  getAll(): Observable<ProductModel[]>;
  getById(id: string): Observable<ProductModel>;
}
export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>('PRODUCT_REPOSITORY');
```

**2.18 Renombrar método `execute()` del caso de uso**

```typescript
// get-products.contract.ts
export interface IGetProductsUseCase {
  getProducts(): Observable<ProductModel[]>;
}
export const GET_PRODUCTS_USE_CASE = new InjectionToken<IGetProductsUseCase>('GET_PRODUCTS_USE_CASE');
```

**2.19 Hacer que `ProductRepositoryImpl` extienda `MRepository`**

```typescript
export class ProductRepositoryImpl extends MRepository implements IProductRepository {
  constructor() { super(environment.restService.url); }
  getAll(): Observable<ProductModel[]> { ... }
}
```

**2.20 Sustituir colores hex y `font-size` en px por tokens del sistema de diseño**

```scss
// ❌ Actual
background-color: #005c3a;
font-size: 14px;

// ✅ Objetivo
background-color: var(--main);
font-size: 0.875rem;
```

**2.21 Convertir providers a factory functions**

```typescript
// ❌ Actual
export const repositoriesProviders: Provider[] = [{ provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl }];

// ✅ Objetivo
export const provideRepositories = (): Provider[] => [{ provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl }];
```

**2.22 Sustituir `private` por `#` en campos y métodos privados**

```typescript
// ❌ Actual
private readonly getProductsUseCase = inject(GetProductsUseCase);
private loadProducts(): void { ... }

// ✅ Objetivo
readonly #getProductsUseCase = inject(GET_PRODUCTS_USE_CASE);
#loadProducts(): void { ... }
```

---

## 3. Lo que está bien

Antes de cerrar, vale la pena reconocer las decisiones correctas que ya están en el código:

- **Arquitectura Clean Architecture** — separación clara de `presentation`, `domain`, `data` y `entities` con inyección de dependencias correctamente configurada en `di/`.
- **Componentes standalone** — todos los componentes usan la API moderna, sin módulos NgModule. Mejor tree-shaking y más simple de mantener.
- **Angular Signals** — se usa `signal()` y `computed()` para el estado local en lugar de `BehaviorSubject`, lo cual es la dirección correcta en Angular moderno.
- **`ChangeDetectionStrategy.OnPush`** — activado en todos los componentes, reduciendo detecciones de cambio innecesarias.
- **TypeScript strict mode** — `"strict": true` en `tsconfig.json` fuerza un tipado más seguro en todo el proyecto.
- **Control flow moderno** — se usa `@if` / `@for` (Angular 17+) en lugar de `*ngIf` / `*ngFor`.
- **Tooling de calidad** — ESLint, Prettier y Stylelint están configurados desde el inicio.
- **Responsive con Bootstrap Grid** — la rejilla está integrada y `cart.page.scss` incluye media queries para móvil.
