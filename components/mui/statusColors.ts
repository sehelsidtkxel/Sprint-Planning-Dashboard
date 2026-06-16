export type StatusType =
  | "Done"
  | "In Progress"
  | "Planned"
  | "Blocked"
  | string;

export function getStatusChipColor(
  status: StatusType
): "success" | "info" | "warning" | "error" | "default" {
  switch (status) {
    case "Done":
      return "success";
    case "In Progress":
      return "info";
    case "Planned":
      return "warning";
    case "Blocked":
      return "error";
    default:
      return "default";
  }
}
