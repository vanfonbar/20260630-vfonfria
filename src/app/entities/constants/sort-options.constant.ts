import { SortOption } from '@/interfaces/sort-option.interface';

export const SORT_OPTIONS: SortOption[] = [
  { value: '', labelKey: 'CATALOG.SORT_DEFAULT', criteria: null },
  { value: 'name_asc', labelKey: 'CATALOG.SORT_NAME_ASC', criteria: { field: 'name', direction: 'asc' } },
  { value: 'name_desc', labelKey: 'CATALOG.SORT_NAME_DESC', criteria: { field: 'name', direction: 'desc' } },
  { value: 'price_asc', labelKey: 'CATALOG.SORT_PRICE_ASC', criteria: { field: 'price', direction: 'asc' } },
  { value: 'price_desc', labelKey: 'CATALOG.SORT_PRICE_DESC', criteria: { field: 'price', direction: 'desc' } }
];
