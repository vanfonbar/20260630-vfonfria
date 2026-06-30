import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { ProductCardComponent } from './product-card.component';
import { Category } from '@/enums/category.enum';
import { Product } from '@/interfaces/product.interface';

const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'Leche entera Hacendado 1L',
  description: 'Leche de vaca entera',
  price: 0.89,
  category: Category.DAIRY,
  imageUrl: 'https://example.com/leche.jpg',
  stock: 150,
  attributes: {}
};

const OUT_OF_STOCK_PRODUCT: Product = { ...MOCK_PRODUCT, id: '2', stock: 0 };

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;

  /**
   * @param {Product} product - The product to render inside the card.
   */
  function createComponent(product: Product = MOCK_PRODUCT): void {
    fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideZonelessChangeDetection(), provideMTranslateTesting()]
    });
  });

  it('should create the component', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the product name', () => {
    createComponent();
    const name = fixture.debugElement.query(By.css('.product-card__name'));
    expect(name.nativeElement.textContent).toContain(MOCK_PRODUCT.name);
  });

  it('should display the product description', () => {
    createComponent();
    const desc = fixture.debugElement.query(By.css('.product-card__description'));
    expect(desc.nativeElement.textContent).toContain(MOCK_PRODUCT.description);
  });

  it('should show stock indicator when product has stock', () => {
    createComponent();
    const stock = fixture.debugElement.query(By.css('.product-card__stock'));
    expect(stock).toBeTruthy();
    expect(stock.nativeElement.classList).not.toContain('product-card__stock--out');
  });

  it('should show out-of-stock indicator when stock is 0', () => {
    createComponent(OUT_OF_STOCK_PRODUCT);
    const stock = fixture.debugElement.query(By.css('.product-card__stock--out'));
    expect(stock).toBeTruthy();
  });

  it('should emit addToCart when the button is clicked and product has stock', () => {
    createComponent();
    let emitted: Product | undefined;
    component.addToCart.subscribe((p: Product) => (emitted = p));

    const button = fixture.debugElement.query(By.css('.product-card__add-btn'));
    button.nativeElement.click();

    expect(emitted).toEqual(MOCK_PRODUCT);
  });

  it('should disable the button when stock is 0', () => {
    createComponent(OUT_OF_STOCK_PRODUCT);
    const button = fixture.debugElement.query(By.css('.product-card__add-btn'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('should apply disabled CSS class when stock is 0', () => {
    createComponent(OUT_OF_STOCK_PRODUCT);
    const button = fixture.debugElement.query(By.css('.product-card__add-btn--disabled'));
    expect(button).toBeTruthy();
  });
});
