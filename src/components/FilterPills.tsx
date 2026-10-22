// ============================================================
// FilterPills.tsx — SkillBench-style filter pills
// ============================================================
import type { FC } from 'react';
import type { FilterPill, CategoryId } from '../types';

interface FilterPillsProps {
  pills: FilterPill[];
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}

const FilterPills: FC<FilterPillsProps> = ({ pills, active, onSelect }) => {
  return (
    <div className="filter-bar">
      {pills.map((pill) => (
        <button
          key={pill.id}
          className={`pill ${active === pill.id ? 'pill-active' : ''}`}
          onClick={() => onSelect(pill.id)}
          aria-pressed={active === pill.id}
        >
          {pill.label}
          {pill.count !== undefined && (
            <span className="pill-count">{pill.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
