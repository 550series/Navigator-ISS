import { useState, useCallback, useMemo } from "react";

interface FilterConfig<T> {
  key: keyof T;
  label: string;
  options: { value: string; label: string }[];
}

export function useFilter<T>(items: T[], _configs: FilterConfig<T>[]) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key as keyof T]);
        return itemValue === value;
      });
    });
  }, [items, filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  return {
    filters,
    filteredItems,
    activeFilterCount,
    handleFilterChange,
    clearFilters,
  };
}
