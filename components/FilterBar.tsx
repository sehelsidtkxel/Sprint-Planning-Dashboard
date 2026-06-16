"use client";

interface FilterBarProps {
  streams: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterBar({
  streams,
  selected,
  onChange,
}: FilterBarProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="border border-slate-300 rounded px-3 py-2 mb-5 min-w-[220px] text-sm"
    >
      <option value="">All Streams</option>

      {streams.map((stream) => (
        <option key={stream} value={stream}>
          {stream}
        </option>
      ))}
    </select>
  );
}
