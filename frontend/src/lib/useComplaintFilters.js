import { useMemo, useState } from 'react';

const DEFAULTS = { search: '', status: 'All Status', priority: 'All Priority', category: 'All Categories' };

export default function useComplaintFilters(list) {
  const [filters, setFilters] = useState(DEFAULTS);

  const onChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const onReset = () => setFilters(DEFAULTS);

  const filtered = useMemo(() => {
    return list.filter((c) => {
      const matchesSearch =
        !filters.search ||
        c.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'All Status' || c.status === filters.status;
      const matchesPriority = filters.priority === 'All Priority' || c.priority === filters.priority;
      const matchesCategory = filters.category === 'All Categories' || c.category === filters.category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [list, filters]);

  return { filters, onChange, onReset, filtered };
}
