import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { AppComponent } from './app.component';
import { CartStorageService } from '@/presentation/services/cart-storage.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let cartCountSignal: ReturnType<typeof signal<number>>;

  beforeEach(() => {
    cartCountSignal = signal(0);

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideMTranslateTesting(),
        {
          provide: CartStorageService,
          useValue: { itemCount: cartCountSignal }
        }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('Badge del carrito', () => {
    it('should not render the badge element when itemCount is 0', () => {
      cartCountSignal.set(0);
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('.m-badge'));
      expect(badge).toBeNull();
    });

    it('should render the badge when itemCount is greater than 0', () => {
      cartCountSignal.set(3);
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('.m-badge'));
      expect(badge).not.toBeNull();
    });

    it('should update the badge reactively when itemCount changes', () => {
      cartCountSignal.set(1);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.m-badge'))).not.toBeNull();

      cartCountSignal.set(0);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.m-badge'))).toBeNull();
    });
  });
});
