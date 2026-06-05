"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search sprints, tasks, features..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        marginBottom: "20px",
        fontSize: "16px"
      }}
    />
  );
}
