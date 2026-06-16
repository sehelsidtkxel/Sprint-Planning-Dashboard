import Paper from "@mui/material/Paper";
import { SxProps, Theme } from "@mui/material/styles";

export default function SectionCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        p: { xs: 2, md: 3 },
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
