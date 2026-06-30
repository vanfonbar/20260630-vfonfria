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
  readonly selected: InputSignal<Category | undefined> = input<Category | undefined>(undefined);
  readonly categoryChange: OutputEmitterRef<Category | undefined> = output<Category | undefined>();

  protected readonly categories: Category[] = Object.values(Category) as Category[];
  protected readonly i18nKeys: Record<Category, string> = CATEGORY_I18N_KEYS;

  protected onSelect(category: Category | undefined): void {
    if (this.selected() === category) {
      return;
    }
    this.categoryChange.emit(category);
  }
}
