import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  readonly searchTerm = signal<string>('');

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  clear(): void {
    this.searchTerm.set('');
  }
}
