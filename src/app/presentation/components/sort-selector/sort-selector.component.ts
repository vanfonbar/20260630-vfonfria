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

import { SortCriteria } from '@/entities/types/sort.types';

interface SortOption {
  value: string;
  labelKey: string;
  criteria: SortCriteria | null;
}

const SORT_OPTIONS: SortOption[] = [
  { value: '', labelKey: 'CATALOG.SORT_DEFAULT', criteria: null },
  { value: 'name_asc', labelKey: 'CATALOG.SORT_NAME_ASC', criteria: { field: 'name', direction: 'asc' } },
  { value: 'name_desc', labelKey: 'CATALOG.SORT_NAME_DESC', criteria: { field: 'name', direction: 'desc' } },
  { value: 'price_asc', labelKey: 'CATALOG.SORT_PRICE_ASC', criteria: { field: 'price', direction: 'asc' } },
  { value: 'price_desc', labelKey: 'CATALOG.SORT_PRICE_DESC', criteria: { field: 'price', direction: 'desc' } }
];

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
    return `${criteria.field}_${criteria.direction}`;
  });

  protected onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const option = SORT_OPTIONS.find((o) => o.value === value);
    this.sortChange.emit(option?.criteria ?? null);
  }
}
