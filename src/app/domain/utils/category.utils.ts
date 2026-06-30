import { Category } from '@/enums/category.enum';

const VALID_CATEGORIES = new Set<string>(Object.values(Category));

/**
 * Parses a raw string from a query param into a valid Category enum value.
 * Returns undefined if the value is empty or does not match any known category.
 *
 * @param {string | null} value - Raw string from the URL query param, or null if absent.
 * @returns {Category | undefined} The matching Category enum value, or undefined if invalid.
 */
export function parseCategory(value: string | null): Category | undefined {
  if (!value || !VALID_CATEGORIES.has(value)) {
    return undefined;
  }
  return value as Category;
}
