import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { SearchStateService } from './search-state.service';

describe('SearchStateService', () => {
  let service: SearchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), SearchStateService]
    });
    service = TestBed.inject(SearchStateService);
  });

  it('should initialize searchTerm as empty string', () => {
    expect(service.searchTerm()).toBe('');
  });

  it('should update searchTerm when setSearchTerm is called', () => {
    service.setSearchTerm('leche');

    expect(service.searchTerm()).toBe('leche');
  });

  it('should reflect the last value when setSearchTerm is called multiple times', () => {
    service.setSearchTerm('leche');
    service.setSearchTerm('pan');

    expect(service.searchTerm()).toBe('pan');
  });

  it('should reset searchTerm to empty string when clear is called', () => {
    service.setSearchTerm('leche');

    service.clear();

    expect(service.searchTerm()).toBe('');
  });

  it('should not throw when clear is called on already empty term', () => {
    expect(() => service.clear()).not.toThrow();
    expect(service.searchTerm()).toBe('');
  });
});
