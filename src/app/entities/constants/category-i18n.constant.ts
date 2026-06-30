import { Category } from '@/enums/category.enum';

export const CATEGORY_I18N_KEYS: Record<Category, string> = {
  [Category.FRESH]: 'CATALOG.FILTER_FRESH',
  [Category.DAIRY]: 'CATALOG.FILTER_DAIRY',
  [Category.BUTCHER]: 'CATALOG.FILTER_BUTCHER',
  [Category.FISHMONGER]: 'CATALOG.FILTER_FISHMONGER',
  [Category.BAKERY]: 'CATALOG.FILTER_BAKERY',
  [Category.BEVERAGES]: 'CATALOG.FILTER_BEVERAGES',
  [Category.FROZEN]: 'CATALOG.FILTER_FROZEN',
  [Category.CLEANING]: 'CATALOG.FILTER_CLEANING'
};
