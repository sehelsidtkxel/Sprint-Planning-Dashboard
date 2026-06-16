"use client";

import { UIInput } from "./ui";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange
}: SearchBarProps) {
  return (
    <div className="mb-5">
      <UIInput
        type="text"
        placeholder="Search sprints, tasks, features..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
