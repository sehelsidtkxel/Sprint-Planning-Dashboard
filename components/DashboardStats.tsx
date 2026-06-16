import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SprintTask } from "../lib/types";

interface Props {
  tasks: SprintTask[];
}

type StatConfig = {
  label: string;
  value: number;
  dotColor: string;
};

const SLATE_300 = "#cbd5e1";

export default function DashboardStats({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;

  const stats: StatConfig[] = [
    { label: "Total Sprints", value: total,     dotColor: "#475569" },
    { label: "Done",          value: done,       dotColor: "#16a34a" },
    { label: "In Progress",   value: inProgress, dotColor: "#2563eb" },
    { label: "Blocked",       value: blocked,    dotColor: "#dc2626" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
        width: "100%",
      }}
    >
      {stats.map((stat, index) => (
        <Box
          key={stat.label}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2,
            px: { xs: 2, md: 3 },
            borderRight: {
              xs: index % 2 === 0 ? `1px solid ${SLATE_300}` : "none",
              md: index < stats.length - 1 ? `1px solid ${SLATE_300}` : "none",
            },
            borderBottom: {
              xs: index < 2 ? `1px solid ${SLATE_300}` : "none",
              md: "none",
            },
          }}
        >
          {/* Colored dot */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: stat.dotColor,
              flexShrink: 0,
            }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.4, display: "block" }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
