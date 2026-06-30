import { SortCriteria } from '@/entities/types/sort.types';

export interface SortOption {
  value: string;
  labelKey: string;
  criteria: SortCriteria | null;
}
