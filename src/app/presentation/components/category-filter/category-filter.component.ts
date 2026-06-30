import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';

import { MTranslatePipe } from '@mercadona/core/translate';

import { CATEGORY_I18N_KEYS } from '@/entities/constants/category-i18n.constant';
import { Category } from '@/enums/category.enum';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MTranslatePipe]
})
export class CategoryFilterComponent {
  readonly selected: InputSignal<Category | null> = input<Category | null>(null);
  readonly categoryChange: OutputEmitterRef<Category | null> = output<Category | null>();

  protected readonly categories: Category[] = Object.values(Category) as Category[];
  protected readonly i18nKeys: Record<Category, string> = CATEGORY_I18N_KEYS;

  protected onSelect(category: Category | null): void {
    if (this.selected() === category) {
      return;
    }
    this.categoryChange.emit(category);
  }
}
