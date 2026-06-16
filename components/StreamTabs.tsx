"use client";

import Box from "@mui/material/Box";

interface Stream {
  id: string;
  name: string;
  color: string;
}

interface Props {
  streams: Stream[];
  tasks: { stream_id?: string; streams?: { id?: string; name?: string } }[];
  backlogCount?: number;
  selectedStream: string;
  onSelectStream: (streamId: string) => void;
}

const TAB_ACTIVE = "#0f172a";
const TAB_INACTIVE = "#94a3b8";
const TAB_INDICATOR = "#2563eb";
const TAB_BORDER = "#e2e8f0";

function countForStream(
  tasks: Props["tasks"],
  stream: Stream
) {
  return tasks.filter(
    (task) =>
      String(task.stream_id) === String(stream.id) ||
      String(task.streams?.id) === String(stream.id) ||
      task.streams?.name === stream.name
  ).length;
}

function formatStreamTabLabel(label: string): string {
  const normalized = label.trim();

  if (/^edge\s*2\.0$/i.test(normalized)) {
    return "edge";
  }

  if (normalized === normalized.toUpperCase() && /[A-Z]/.test(normalized)) {
    return normalized
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return normalized;
}

function TabLabel({
  label,
  count,
  isSelected,
}: {
  label: string;
  count?: number;
  isSelected?: boolean;
}) {
  const displayLabel = formatStreamTabLabel(label);

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        textTransform: "none",
      }}
    >
      <Box component="span" sx={{ whiteSpace: "nowrap" }}>
        {displayLabel}
      </Box>
      {count !== undefined && (
        <Box
          component="span"
          sx={{
            minWidth: 22,
            height: 22,
            px: 0.75,
            borderRadius: "9999px",
            bgcolor: isSelected ? "#0f172a" : "#e2e8f0",
            color: isSelected ? "#ffffff" : "#475569",
            fontSize: "0.75rem",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

export default function StreamTabs({
  streams,
  tasks,
  backlogCount = 0,
  selectedStream,
  onSelectStream,
}: Props) {
  const tabs = [
    {
      id: "all",
      label: "All Streams",
      count: tasks.length,
    },
    ...streams.map((stream) => ({
      id: String(stream.id),
      label: stream.name,
      count: countForStream(tasks, stream),
    })),
    {
      id: "backlog",
      label: "Backlog",
      count: backlogCount,
    },
  ];

  const tabValues = tabs.map((tab) => tab.id);
  const normalizedSelection = String(selectedStream);
  const activeTab = tabValues.includes(normalizedSelection)
    ? normalizedSelection
    : "all";

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${TAB_BORDER}`,
        mb: 3,
      }}
    >
      <Box
        role="tablist"
        aria-label="Stream filters"
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: { xs: 3, md: 5 },
          overflowX: "auto",
          minHeight: 48,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectStream(tab.id)}
              sx={{
                flexShrink: 0,
                border: "none",
                background: "none",
                cursor: "pointer",
                font: "inherit",
                position: "relative",
                minHeight: 48,
                px: 0.5,
                py: 1,
                mr: 0.5,
                color: isSelected ? TAB_ACTIVE : TAB_INACTIVE,
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.9375rem",
                letterSpacing: "normal",
                textTransform: "none",
                borderBottom: `2px solid ${isSelected ? TAB_INDICATOR : "transparent"}`,
                mb: "-1px",
                transition: "color 0.15s ease, border-color 0.15s ease",
                "&:hover": {
                  color: TAB_ACTIVE,
                },
              }}
            >
              <TabLabel
                label={tab.label}
                count={tab.count}
                isSelected={isSelected}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
