interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  let color =
    "bg-gray-500";

  if (status === "Done")
    color = "bg-green-600";

  if (status === "In Progress")
    color = "bg-blue-600";

  if (status === "Planned")
    color = "bg-yellow-500";

  if (status === "Blocked")
    color = "bg-red-600";

  return (
    <span
      className={`${color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
    >
      {status}
    </span>
  );
}