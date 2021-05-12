import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeToFwkaComponent } from './welcome-to-fwka.component';

describe('WelcomeToFwkaComponent', () => {
  let component: WelcomeToFwkaComponent;
  let fixture: ComponentFixture<WelcomeToFwkaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeToFwkaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeToFwkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
