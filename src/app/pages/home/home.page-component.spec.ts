import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { MLoggerModule } from '@mercadona/core/logger';
import { HomePageComponent } from './home.page-component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MLoggerModule.forRoot({
        logLevel: environment.logLevel
      })],
      declarations: [HomePageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
