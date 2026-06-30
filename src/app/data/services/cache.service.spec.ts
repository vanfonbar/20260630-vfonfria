import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), CacheService]
    });
    service = TestBed.inject(CacheService);
  });

  describe('getOrFetch', () => {
    it('should execute source$ and return its value on first call', () => {
      const source$ = of(['a', 'b']);
      let result: string[] | undefined;

      service.getOrFetch('key1', source$).subscribe((v) => (result = v));

      expect(result).toEqual(['a', 'b']);
    });

    it('should return the cached value without executing source$ on second call', () => {
      let sourceExecutions = 0;
      const countedSource$ = new Observable<string>((observer) => {
        sourceExecutions++;
        observer.next('fetched');
        observer.complete();
      });

      service.getOrFetch('key2', countedSource$).subscribe();
      service.getOrFetch('key2', countedSource$).subscribe();

      expect(sourceExecutions).toBe(1);
    });

    it('should cache different keys independently', () => {
      let resultA: string | undefined;
      let resultB: string | undefined;

      service.getOrFetch('keyA', of('value-A')).subscribe((v) => (resultA = v));
      service.getOrFetch('keyB', of('value-B')).subscribe((v) => (resultB = v));

      expect(resultA).toBe('value-A');
      expect(resultB).toBe('value-B');
    });

    it('should not mix cached values between different keys', () => {
      service.getOrFetch('keyX', of('first')).subscribe();

      let result: string | undefined;
      service.getOrFetch('keyY', of('second')).subscribe((v) => (result = v));

      expect(result).toBe('second');
    });

    it('should return the exact same reference for a cache hit', () => {
      const original = [{ id: '1' }];
      service.getOrFetch('ref-key', of(original)).subscribe();

      let cached: typeof original | undefined;
      service.getOrFetch('ref-key', of([{ id: '2' }])).subscribe((v) => (cached = v));

      expect(cached).toBe(original);
    });
  });

  describe('clear', () => {
    it('should force source$ to re-execute after clear()', () => {
      const fetchFn = jasmine.createSpy('fetchFn').and.returnValue(of('value'));

      service.getOrFetch('key', fetchFn()).subscribe();
      service.clear();
      service.getOrFetch('key', fetchFn()).subscribe();

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should clear all keys, not just one', () => {
      const fetchA = jasmine.createSpy('fetchA').and.returnValue(of('a'));
      const fetchB = jasmine.createSpy('fetchB').and.returnValue(of('b'));

      service.getOrFetch('keyA', fetchA()).subscribe();
      service.getOrFetch('keyB', fetchB()).subscribe();
      service.clear();
      service.getOrFetch('keyA', fetchA()).subscribe();
      service.getOrFetch('keyB', fetchB()).subscribe();

      expect(fetchA).toHaveBeenCalledTimes(2);
      expect(fetchB).toHaveBeenCalledTimes(2);
    });

    it('should not throw when called on an empty cache', () => {
      expect(() => service.clear()).not.toThrow();
    });
  });
});
