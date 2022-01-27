import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MLoggerService } from '@mercadona/core/logger';
import { MLoggerTestingModule } from '@mercadona/core/logger/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let mLoggerService: MLoggerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MLoggerTestingModule],
      declarations: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    mLoggerService = TestBed.inject(MLoggerService);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('when ngOnInit() is called it should log "Welcome to FWK Front Angular Responsive"', () => {
    const logText = 'Welcome to FWK Front Angular Responsive';
    const logSpy = spyOn(mLoggerService, 'log');

    app.ngOnInit();

    expect(logSpy).toHaveBeenCalledWith(logText);
  });

  it('when goToUrl() is called it should open new tab in browser', () => {
    const url = 'http://localhost/test';
    const openTabSpy = spyOn(window, 'open');

    app.goToUrl(url);

    expect(openTabSpy).toHaveBeenCalledWith(url, '_blank');
  });
});
