interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case "done":
        return "#16a34a";

      case "in progress":
        return "#f59e0b";

      case "blocked":
        return "#dc2626";

      default:
        return "#64748b";
    }
  };

  return (
    <span
      style={{
        background: getColor(),
        color: "#ffffff",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      {status}
    </span>
  );
}
