
import { useState, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSortableTable<T>(items: T[] | undefined, initialConfig?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialConfig || null);
  
  const sortedItems = useCallback(() => {
    if (!items?.length || !sortConfig) {
      return items;
    }
    
    return [...items].sort((a: any, b: any) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);
  
  const requestSort = useCallback((key: string) => {
    let direction: SortDirection = 'asc';
    
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  }, [sortConfig]);
  
  return { 
    items: sortedItems(), 
    requestSort, 
    sortConfig 
  };
}
