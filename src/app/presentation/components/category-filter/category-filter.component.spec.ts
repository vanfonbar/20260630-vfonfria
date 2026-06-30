import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideMTranslateTesting } from '@mercadona/core/translate/testing';

import { CategoryFilterComponent } from './category-filter.component';
import { Category } from '@/enums/category.enum';

const ALL_CATEGORIES = Object.values(Category) as Category[];

describe('CategoryFilterComponent', () => {
  let fixture: ComponentFixture<CategoryFilterComponent>;
  let component: CategoryFilterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoryFilterComponent],
      providers: [provideZonelessChangeDetection(), provideMTranslateTesting()]
    });
  });

  /**
   * @param {Category | null} selected - Initial value for the selected input signal.
   */
  function createComponent(selected: Category | undefined = undefined): void {
    fixture = TestBed.createComponent(CategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
  }

  /**
   * @returns {DebugElement[]} All filter item buttons in the component.
   */
  function getButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.category-filter__item'));
  }

  /**
   * @returns {DebugElement[]} All filter item buttons with the active modifier class.
   */
  function getActiveButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.category-filter__item--active'));
  }

  // ─── Renderizado ─────────────────────────────────────────────────────────────

  describe('Renderizado', () => {
    it('should render one "Todas" button plus one button per category', () => {
      createComponent();

      expect(getButtons().length).toBe(ALL_CATEGORIES.length + 1);
    });

    it('should render inside a radiogroup container', () => {
      createComponent();
      const container = fixture.debugElement.query(By.css('.category-filter'));

      expect(container.nativeElement.getAttribute('role')).toBe('radiogroup');
    });
  });

  // ─── Estado activo: selected = null ──────────────────────────────────────────

  describe('Estado activo cuando selected es undefined ("Todas")', () => {
    beforeEach(() => createComponent(undefined));

    it('should apply the active modifier class to the "Todas" button', () => {
      expect(getButtons()[0].classes['category-filter__item--active']).toBeTrue();
    });

    it('should not apply the active class to any category button', () => {
      const categoryButtons = getButtons().slice(1);

      categoryButtons.forEach((btn) => {
        expect(btn.classes['category-filter__item--active']).toBeFalsy();
      });
    });

    it('should set aria-checked="true" only on the "Todas" button', () => {
      const buttons = getButtons();

      expect(buttons[0].nativeElement.getAttribute('aria-checked')).toBe('true');
      buttons.slice(1).forEach((btn) => {
        expect(btn.nativeElement.getAttribute('aria-checked')).toBe('false');
      });
    });

    it('should have exactly one active button', () => {
      expect(getActiveButtons().length).toBe(1);
    });
  });

  // ─── Estado activo: selected = Category ──────────────────────────────────────

  describe('Estado activo cuando selected es una categoría', () => {
    const CATEGORY_INDEX = ALL_CATEGORIES.indexOf(Category.DAIRY);

    beforeEach(() => createComponent(Category.DAIRY));

    it('should NOT apply the active class to "Todas"', () => {
      expect(getButtons()[0].classes['category-filter__item--active']).toBeFalsy();
    });

    it('should apply the active class to the matching category button', () => {
      // +1 because index 0 is "Todas"
      expect(getButtons()[CATEGORY_INDEX + 1].classes['category-filter__item--active']).toBeTrue();
    });

    it('should have exactly one active button', () => {
      expect(getActiveButtons().length).toBe(1);
    });

    it('should set aria-checked="true" only on the active category button', () => {
      const buttons = getButtons();
      const activeIndex = CATEGORY_INDEX + 1;

      buttons.forEach((btn, i) => {
        const expected = i === activeIndex ? 'true' : 'false';
        expect(btn.nativeElement.getAttribute('aria-checked')).toBe(expected);
      });
    });
  });

  // ─── Reactividad al cambiar el input ─────────────────────────────────────────

  describe('Reactividad al cambiar el input selected', () => {
    it('should update the active button when selected changes from null to a category', () => {
      createComponent(undefined);

      fixture.componentRef.setInput('selected', Category.BAKERY);
      fixture.detectChanges();

      expect(getButtons()[0].classes['category-filter__item--active']).toBeFalsy();
      expect(getActiveButtons().length).toBe(1);
    });

    it('should update the active button when selected changes from one category to another', () => {
      createComponent(Category.DAIRY);
      const dairyIndex = ALL_CATEGORIES.indexOf(Category.DAIRY) + 1;

      fixture.componentRef.setInput('selected', Category.BAKERY);
      fixture.detectChanges();

      expect(getButtons()[dairyIndex].classes['category-filter__item--active']).toBeFalsy();
      expect(getActiveButtons().length).toBe(1);
    });

    it('should restore "Todas" as active when selected changes back to undefined', () => {
      createComponent(Category.DAIRY);

      fixture.componentRef.setInput('selected', undefined);
      fixture.detectChanges();

      expect(getButtons()[0].classes['category-filter__item--active']).toBeTrue();
      expect(getActiveButtons().length).toBe(1);
    });
  });

  // ─── Emisión de eventos ───────────────────────────────────────────────────────

  describe('Emisión de eventos', () => {
    it('should emit undefined when "Todas" is clicked and a category was previously active', () => {
      createComponent(Category.DAIRY);
      let emitted: Category | undefined;
      component.categoryChange.subscribe((cat) => (emitted = cat));

      getButtons()[0].nativeElement.click();

      expect(emitted).toBeUndefined();
    });

    it('should emit the category when its button is clicked', () => {
      createComponent(undefined);
      let emitted: Category | undefined;
      component.categoryChange.subscribe((cat) => (emitted = cat));

      const freshIndex = ALL_CATEGORIES.indexOf(Category.FRESH) + 1;
      getButtons()[freshIndex].nativeElement.click();

      expect(emitted).toBe(Category.FRESH);
    });

    it('should emit the new category when switching from one category to another', () => {
      createComponent(Category.DAIRY);
      let emitted: Category | undefined;
      component.categoryChange.subscribe((cat) => (emitted = cat));

      const bakeryIndex = ALL_CATEGORIES.indexOf(Category.BAKERY) + 1;
      getButtons()[bakeryIndex].nativeElement.click();

      expect(emitted).toBe(Category.BAKERY);
    });

    it('should NOT emit when clicking the already-active "Todas" button', () => {
      createComponent(undefined);
      let emitCount = 0;
      component.categoryChange.subscribe(() => emitCount++);

      getButtons()[0].nativeElement.click();

      expect(emitCount).toBe(0);
    });

    it('should NOT emit when clicking the already-active category button', () => {
      createComponent(Category.DAIRY);
      let emitCount = 0;
      component.categoryChange.subscribe(() => emitCount++);

      const dairyIndex = ALL_CATEGORIES.indexOf(Category.DAIRY) + 1;
      getButtons()[dairyIndex].nativeElement.click();

      expect(emitCount).toBe(0);
    });
  });
});
