import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environment';
import { MLoggerModule } from '@mercadona/core/logger';
import { AppComponent } from './app.component';
import { MPlatformEnvironment } from '@mercadona/core/platform';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MLoggerModule.forRoot({
          logLevel: environment.logLevel
        })
      ],
      declarations: [AppComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('environment env must exist', () => {
    const env: MPlatformEnvironment = environment.env;
    expect(env).toBeDefined();
  });

  it('environment production must exist', () => {
    const production = environment.production;
    expect(production).toBeDefined();
  });
});
