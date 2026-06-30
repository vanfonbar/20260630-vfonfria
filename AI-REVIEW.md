# Snippet 1 – Componente de lista de productos

## 1. Problemas encontrados

### 1.1 Bugs

- falta el método ngOnInit() la clase implementa OnInit pero no el método
- products esta tipado con any, deberia tener una interfaz o una clase Product
- la suscripción creada en el constructor no se cancela nunca
- JSON.parse() no está protegido con try-catch

### 1.2 Mala práctica

- \*ngFor se recomienda el uso del nuevo control-flow de Angular @for
- atributo style dentro de la etiqueta span, se debe incluir un regla css con esa infornación y almacenarla en un fichero con extension.scss
- el texto esta harcodeado debería existir un fichero de traducción i18n y utilizar un servicio o un pipe para traducirlo
- la suscripión debería inicializarse en el ngOInit() no en el contructor()
- inyectar el servicio en el constructor, mejor hacerlo con inject()
- se recomienta el uso de signals para la detección de cambios reactiva.

### 1.3 Rendimiento

- al \*ngFor le falta el track

### 1.4 Accesibilidad

- a la etiqueta img le falta el atributo alt, atributo descriptivo que se requiere por si no carga la imagen

### 1.5 Seguridad

- no se comprueba que product tenga valor a la hora de añadirlo en el localStorage

## 2. Snippet Corregido

html

@for (product of products(); track product.id) {

```
  <div class="product-list">
  <img src="{{ product.imageUrl }}" alt="imagen">
  <span>{{ product.name }}</span>
  <span class="product_list__price">{{ product.price }}€</span>
  <div (click)="addToCart(product)">{{ 'CARD.ADD' | mTranslate }}</div>
</div>
```

}css

```
.product_list{
  &__price{
    color: green; font-weight: bold
  }
}
```

ts

```
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MTranslatePipe
  ]
})
export class ProductListComponent implements OnInit {
  protected readonly products: Signal<Product[]> = toSignal(
    this.productService.getProducts().pipe(
      catchError((): Observable<Product[]> => {
        this.loadError.set(true);
        return of<Product[]>([]);
      })
    ),
    { initialValue: [] as Product[] }
  );

  addToCart(product: Product) {
    if(product) {
      try {
        localStorage.setItem('cart', JSON.stringify([...JSON.parse(localStorage.getItem('cart')), product]));
      }
      catch(){
          return [];
      }
    }
  }
}

```

# Snippet 2 – Use-case de búsqueda con RxJS

## 1. Problemas encontrados

### 1.1 Bugs

- faltan tipar todas las variables

### 1.2 Mala práctica

- repository deberia ser privado con #repository
- orden de las variables, las privadas van al final

### 1.3 Rendimiento

- en lugar de utilizar mergeMap es mejor usar Switchmap porque mergemap no cancela suscripciones anteriores y Switchmap solo se queda con la última

- no se libera la memoria, se deberia incluir takeUntilDestroyed())
- añadir distinctUntilChanged() para que solo deje pasar valores distintos a los anteriores

### 1.4 Accesibilidad

### 1.5 Seguridad

## 2. Snippet Corregido

```
@Injectable()
export class SearchProductsUseCase {
   isLoading: boolean = false;

  private readonly #repository: ProductRepository = inject(ProductRepository);

  private readonly searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly category$: BehaviorSubject<string> = new BehaviorSubject<string>('');



  readonly results$ = combineLatest([
    this.searchTerm$,
    this.category$
  ]).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.isLoading = true),
    switchMap(([term, category]) =>
      this.repository.search(term, category).pipe(
        catchError(err => {
          console.log('Error al cargar productos', err);
          return EMPTY;
        }),
        tap(() => this.isLoading = false)
      )
    )
  );

  execute(term: string): void {
    this.searchTerm$.next(term);
  }

  filterByCategory(category: string): void {
    this.category$.next(category);
  }
}
```

# Snippet 3 – Formulario de confirmación de pedido (Reactive Forms)

## 1. Problemas encontrados

### 1.1 Bugs

- form no tiapado
- no se puede usar el setValue dentro del valueChages, es el que lo activa, sería como un bucle infinito

### 1.2 Mala práctica

### 1.3 Rendimiento

- faltaría añadir el takeUntilDestroyed para liberar memoria

### 1.4 Accesibilidad

### 1.5 Seguridad

## 2. Snippet Corregido

```
@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    address: new FormControl(''),
    urgent: new FormControl(false)
  });

  ngOnInit(): void {
    this.form.get('email').valueChanges
      .pipe(takeUntilDestroyed)
      .subscribe(val => {
      this.form.get('email').setValue(val.toLowerCase());
    });

    this.form.get('urgent').valueChanges
      .pipe(takeUntilDestroyed)
      .subscribe(isUrgent => {
      if (isUrgent) {
        this.form.get('address').setValidators(Validators.required);
      } else {
        this.form.get('address').clearValidators();
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    return this.form.get(field).invalid;
  }

  submit(): void {
    if (!this.form.valid) return;
    this.orderService.create(this.form.value).subscribe();
  }
}
```

---

# Snippet 4 – Pipe de filtrado

## 1. Problemas encontrados

### 1.1 Bugs

- products no esta tipado
- el método transform devuelve any

### 1.2 Mala práctica

### 1.3 Rendimiento

- se usa dos veces searchTerm.toLowerCase() se podria hacer una variable para no calcularlo dos veces

### 1.4 Accesibilidad

### 1.5 Seguridad

## 2. Snippet Corregido

```
@Pipe({ name: 'filterProducts' })
export class FilterProductsPipe implements PipeTransform {
  transform(products: any[], searchTerm: string): any[] {
    return products.filter(p => {
      const search: string = searchTerm.toLowerCase();

      return p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search);
    });
  }
}

```

---

# Snippet 5 – Servicio de carrito con Signals

## 1. Problemas encontrados

### 1.1 Bugs

- variables no estan tipado
- existing.quantity++; esta asignacion no es correcta, tendria que usar set o update
- en el metodo clear no se puede volver a poner signal() para vaciar el array, seria con set o update

### 1.2 Mala práctica-

- el método addITem debería estar debajo de la signal total, primero se declaran las variables y luego los métodos
- los signals deberian ser protected y readonly

### 1.3 Rendimiento

### 1.4 Accesibilidad

### 1.5 Seguridad

## 2. Snippet Corregido

@Injectable({ providedIn: 'root' })
export class CartService {
protected readonly cart: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
protected readonly total: Signal<number> = computed((): number =>
this.cart().reduce((acc: number, item: CartItem): number => acc + item.product.price \* item.quantity, 0)
);

addItem(product: Product): void {
const current: CartItem[] = this.cart();
const existing: CartItem | undefined = current.find(i => i.product.id == product.id);
if (existing) {
this.cart.set([...current, { product, quantity: product.stock + 1 }]);
} else {
this.cart.set([...current, { product, quantity: 1 }]);
}
}

clearCart(): void {
this.cart.set([]);
}
}
