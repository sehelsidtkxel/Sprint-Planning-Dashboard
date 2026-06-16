import Chip from "@mui/material/Chip";
import { getStatusChipColor } from "./mui/statusColors";

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  return (
    <Chip
      label={status}
      color={getStatusChipColor(status)}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}
