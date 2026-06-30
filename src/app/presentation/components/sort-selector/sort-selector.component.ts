import {
  ChangeDetectionStrategy,
  Component,
  computed,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
  Signal
} from '@angular/core';

import { MTranslatePipe } from '@mercadona/core/translate';

import { SORT_OPTIONS } from '@/entities/constants/sort-options.constant';
import { SortCriteria } from '@/entities/types/sort.types';
import { SortOption } from '@/interfaces/sort-option.interface';

@Component({
  selector: 'app-sort-selector',
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MTranslatePipe]
})
export class SortSelectorComponent {
  readonly selected: InputSignal<SortCriteria | null> = input<SortCriteria | null>(null);
  readonly sortChange: OutputEmitterRef<SortCriteria | null> = output<SortCriteria | null>();

  protected readonly options: SortOption[] = SORT_OPTIONS;

  protected readonly selectedValue: Signal<string> = computed<string>(() => {
    const criteria = this.selected();
    if (!criteria) {
      return '';
    }
    const key = `${criteria.field}_${criteria.direction}`;
    return SORT_OPTIONS.some((o) => o.value === key) ? key : '';
  });

  protected onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const option = SORT_OPTIONS.find((o) => o.value === value);
    this.sortChange.emit(option?.criteria ?? null);
  }
}
