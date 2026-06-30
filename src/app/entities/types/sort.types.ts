export type SortField = 'price' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface SortCriteria {
  field: SortField;
  direction: SortDirection;
}
