'use client';

export type SortOption = 'popularite' | 'note' | 'temps' | 'alpha' | 'difficulty';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortControls({ sortBy, onChange }: SortControlsProps) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-3 py-2.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
    >
      <option value="popularite">Popularité</option>
      <option value="note">Note</option>
      <option value="temps">Temps</option>
      <option value="difficulty">Piquant</option>
      <option value="alpha">A – Z</option>
    </select>
  );
}
