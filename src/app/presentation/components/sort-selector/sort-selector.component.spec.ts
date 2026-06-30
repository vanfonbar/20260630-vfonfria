import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { SortSelectorComponent } from './sort-selector.component';
import { SortCriteria } from '@/entities/types/sort.types';

describe('SortSelectorComponent', () => {
  let fixture: ComponentFixture<SortSelectorComponent>;
  let component: SortSelectorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SortSelectorComponent],
      providers: [provideZonelessChangeDetection(), provideMTranslateTesting()]
    });

    fixture = TestBed.createComponent(SortSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 options (default + 4 sort criteria)', () => {
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(5);
  });

  it('should have empty string selected by default', () => {
    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.value).toBe('');
  });

  it('should reflect selected input as the selected option', () => {
    const criteria: SortCriteria = { field: 'price', direction: 'asc' };
    fixture.componentRef.setInput('selected', criteria);
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    expect(select.value).toBe('price_asc');
  });

  it('should emit sortChange with SortCriteria when a sort option is selected', () => {
    let emitted: SortCriteria | null | undefined;
    component.sortChange.subscribe((v) => (emitted = v));

    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    select.value = 'name_asc';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual({ field: 'name', direction: 'asc' });
  });

  it('should emit null when the default (no sort) option is selected', () => {
    fixture.componentRef.setInput('selected', { field: 'price', direction: 'asc' });
    fixture.detectChanges();
    let emitted: SortCriteria | null | undefined;
    component.sortChange.subscribe((v) => (emitted = v));

    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toBeNull();
  });

  it('should return empty string for selectedValue when selected is null', () => {
    fixture.componentRef.setInput('selected', null);
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe('');
  });

  it('should return empty string for selectedValue when criteria does not match any option', () => {
    fixture.componentRef.setInput('selected', { field: 'name', direction: 'asc' } as SortCriteria);
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe('name_asc');
  });
});
