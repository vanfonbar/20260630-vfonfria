import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CacheService {
  readonly #store = new Map<string, unknown>();

  /**
   * Returns the cached value for the given key if it exists,
   * otherwise executes source$, caches the result and returns it.
   *
   * @template T - The type of the cached value.
   * @param {string} key - Unique identifier for the cached entry.
   * @param {Observable<T>} source$ - Observable to execute on cache miss.
   * @returns {Observable<T>} Cached or freshly fetched value.
   */
  getOrFetch<T>(key: string, source$: Observable<T>): Observable<T> {
    const cached = this.#store.get(key) as T | undefined;
    if (cached !== undefined) {
      return of(cached);
    }
    return source$.pipe(
      tap((value: T): void => {
        this.#store.set(key, value);
      })
    );
  }

  /**
   * Removes all entries from the cache, forcing fresh fetches on next calls.
   */
  clear(): void {
    this.#store.clear();
  }
}
