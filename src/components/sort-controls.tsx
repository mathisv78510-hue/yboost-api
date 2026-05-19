'use client';

export type SortOption = 'popularite' | 'note' | 'temps' | 'alpha' | 'piquant';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortControls({ sortBy, onChange }: SortControlsProps) {
  return (
    <div className="flex gap-4 flex-wrap md:flex-nowrap">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="pl-12 pr-12 py-4 border-2 border-orange-200/60 rounded-2xl bg-gradient-to-br from-white via-white to-orange-50/30 text-gray-800 font-semibold focus:outline-none focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-orange-300 hover:scale-[1.02] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23f97316%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[center_right_1rem] bg-no-repeat"
        >
          <option value="popularite">📈 Popularité</option>
          <option value="note">⭐ Note</option>
          <option value="temps">⏱️ Temps</option>
          <option value="piquant">🌶️ Piquant</option>
          <option value="alpha">🔤 A - Z</option>
        </select>
      </div>
    </div>
  );
}
