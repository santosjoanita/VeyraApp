import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService {
  filterArray<T>(array: T[], searchTerm: string, fields: (keyof T | string)[]): T[] {
    if (!array || !searchTerm || searchTerm.trim() === '') return array;
    const lowerCaseTerm = searchTerm.toLowerCase();

    return array.filter((item) =>
      fields.some((field) => {
        const value = (item as any)[field];
        return value ? String(value).toLowerCase().includes(lowerCaseTerm) : false;
      }),
    );
  }

  sortArray<T>(array: T[], field: keyof T | string, order: 'asc' | 'desc'): T[] {
    if (!array) return array;

    return [...array].sort((a, b) => {
      const rawA = (a as any)[field];
      const rawB = (b as any)[field];

      const valA = rawA ?? '';
      const valB = rawB ?? '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filterArrayByValue<T>(array: T[], field: keyof T | string, value: string): T[] {
    if (!array) return [];
    if (!value || value === 'all') return array;
    return array.filter(
      (item) => String((item as any)[field]).toLowerCase() === value.toLowerCase(),
    );
  }
}
