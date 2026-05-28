export function filterArray<T>(array: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  if (!array || !searchTerm || searchTerm.trim() === '') {
    return array;
  }

  const lowerCaseTerm = searchTerm.toLowerCase();

  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value ? String(value).toLowerCase().includes(lowerCaseTerm) : false;
    });
  });
}

export function sortArray<T>(array: T[], field: keyof T, order: 'asc' | 'desc'): T[] {
  if (!array) return array;

  return [...array].sort((a, b) => {
    const valA = String(a[field] || '');
    const valB = String(b[field] || '');
    
    return order === 'asc' 
      ? valA.localeCompare(valB) 
      : valB.localeCompare(valA);
  });
}
export function filterArrayByValue<T>(array: T[], field: keyof T, value: string): T[] {
  if (!array) return [];
  if (!value || value === 'all') return array;

  return array.filter(item => String(item[field]).toLowerCase() === value.toLowerCase());
}