import { Category } from '@/enums/category.enum';

const VALID_CATEGORIES = new Set<string>(Object.values(Category));

/**
 *
 * @param value
 */
export function parseCategory(value: string | null): Category | null {
  if (!value || !VALID_CATEGORIES.has(value)) {
    return null;
  }
  return value as Category;
}
