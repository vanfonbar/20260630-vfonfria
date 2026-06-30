import { Category } from '@/enums/category.enum';

const VALID_CATEGORIES = new Set<string>(Object.values(Category));

/**
 * Parses a raw string from a query param into a valid Category enum value.
 * Returns null if the value is empty or does not match any known category.
 *
 * @param {string | null} value - Raw string from the URL query param, or null if absent.
 * @returns {Category | null} The matching Category enum value, or null if invalid.
 */
export function parseCategory(value: string | null): Category | null {
  if (!value || !VALID_CATEGORIES.has(value)) {
    return null;
  }
  return value as Category;
}
