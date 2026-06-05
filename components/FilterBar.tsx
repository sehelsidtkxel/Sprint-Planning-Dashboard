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
      style={{
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        marginBottom: "20px",
        minWidth: "220px"
      }}
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
