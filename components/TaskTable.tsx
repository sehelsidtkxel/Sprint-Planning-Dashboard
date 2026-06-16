"use client";

import { useEffect, useMemo, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ChevronDown, Plus } from "lucide-react";
import { AppIcon } from "./icons";
import StatusBadge from "./StatusBadge";
import RichTextDisplay from "./RichTextDisplay";
import FeatureSuggestion from "./FeatureSuggestion";
import SectionCard from "./mui/SectionCard";
import { SprintTask } from "../lib/types";

interface Props {
  tasks: SprintTask[];
}

function getProgress(status?: string) {
  switch (status) {
    case "Done":
      return 100;
    case "In Progress":
      return 60;
    case "Blocked":
      return 10;
    default:
      return 20;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getReleaseWeek(dateValue?: string) {
  if (!dateValue) return "Not set";

  const date = new Date(dateValue);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const week = Math.ceil(day / 7);

  const suffix =
    week === 1 ? "1st" : week === 2 ? "2nd" : week === 3 ? "3rd" : `${week}th`;

  return `${month} ${suffix} week (${date.getFullYear()})`;
}

function getStreamPastelTheme(color?: string) {
  switch (color?.toLowerCase()) {
    case "green":
      return {
        bg: "#dcfce7",
        text: "#166534",
        accent: "#22c55e",
        progressTrack: "#bbf7d0",
        progressBar: "#4ade80",
        chipBg: "rgba(74, 222, 128, 0.2)",
      };
    case "orange":
      return {
        bg: "#ffedd5",
        text: "#9a3412",
        accent: "#f97316",
        progressTrack: "#fed7aa",
        progressBar: "#fb923c",
        chipBg: "rgba(251, 146, 60, 0.2)",
      };
    case "red":
      return {
        bg: "#fee2e2",
        text: "#991b1b",
        accent: "#ef4444",
        progressTrack: "#fecaca",
        progressBar: "#f87171",
        chipBg: "rgba(248, 113, 113, 0.2)",
      };
    case "purple":
      return {
        bg: "#f3e8ff",
        text: "#6b21a8",
        accent: "#a855f7",
        progressTrack: "#e9d5ff",
        progressBar: "#c084fc",
        chipBg: "rgba(192, 132, 252, 0.2)",
      };
    case "blue":
      return {
        bg: "#dbeafe",
        text: "#1e40af",
        accent: "#3b82f6",
        progressTrack: "#bfdbfe",
        progressBar: "#60a5fa",
        chipBg: "rgba(96, 165, 250, 0.2)",
      };
    default:
      return {
        bg: "#f1f5f9",
        text: "#334155",
        accent: "#64748b",
        progressTrack: "#e2e8f0",
        progressBar: "#94a3b8",
        chipBg: "rgba(148, 163, 184, 0.25)",
      };
  }
}

function getResourceChips(resources?: string) {
  if (!resources) return [];

  return resources
    .replaceAll("**", "")
    .split(/\n|,|•|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatUpdated(dateString?: string) {
  if (!dateString) return "Recently updated";

  return `Updated ${new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

const SPRINT_STAT_CLASSES: Record<string, { pill: string; count: string }> = {
  Planned: {
    pill: "bg-orange-100 text-orange-700",
    count: "bg-orange-400 text-white",
  },
  "In Progress": {
    pill: "bg-sky-100 text-sky-700",
    count: "bg-sky-400 text-white",
  },
  Done: {
    pill: "bg-emerald-100 text-emerald-700",
    count: "bg-emerald-400 text-white",
  },
  Blocked: {
    pill: "bg-rose-100 text-rose-700",
    count: "bg-rose-400 text-white",
  },
};

function SprintStatBadge({ label, count }: { label: string; count: number }) {
  const classes = SPRINT_STAT_CLASSES[label] ?? SPRINT_STAT_CLASSES.Planned;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${classes.pill}`}
    >
      <span className="text-xs font-semibold">{label}</span>
      <span
        className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-2 text-xs font-bold leading-none ${classes.count}`}
      >
        {count}
      </span>
    </span>
  );
}

export default function TaskTable({ tasks }: Props) {
  const [openStreams, setOpenStreams] = useState<string[]>([]);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const groupedStreams = tasks.reduce((acc: any, sprint: any) => {
    const streamName = sprint.streams?.name || "Unassigned";

    if (!acc[streamName]) {
      acc[streamName] = [];
    }

    acc[streamName].push(sprint);
    return acc;
  }, {});

  const streamNames = useMemo(() => Object.keys(groupedStreams), [tasks]);
  const streamNamesKey = streamNames.join("|");

  useEffect(() => {
    setOpenStreams((current) => {
      if (current.length === 0) {
        return streamNames;
      }

      const visibleSet = new Set(streamNames);
      return current.filter((name) => visibleSet.has(name));
    });
  }, [streamNamesKey, streamNames]);

  if (tasks.length === 0) {
    return (
      <SectionCard sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          No sprints found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          No sprint data is available for the selected stream.
        </Typography>
      </SectionCard>
    );
  }

  return (
    <Stack spacing={4}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Sprint Releases
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.25 }}>
            Track progress and details by stream
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSuggestionForm(true)}
          startIcon={<AppIcon icon={Plus} size="sm" />}
          sx={{
            borderRadius: "4px",
            bgcolor: "#161616",
            boxShadow: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#0d0d0d",
              boxShadow: "none",
            },
          }}
        >
          Add feature request
        </Button>
      </Stack>

      <FeatureSuggestion
        open={showSuggestionForm}
        onClose={() => setShowSuggestionForm(false)}
        onSubmitted={() => setShowSuggestionForm(false)}
      />

      {Object.entries(groupedStreams).map(
        ([streamName, streamSprints]: any) => {
          const isOpen = openStreams.includes(streamName);

          const planned = streamSprints.filter(
            (t: any) => t.status === "Planned"
          ).length;
          const inProgress = streamSprints.filter(
            (t: any) => t.status === "In Progress"
          ).length;
          const done = streamSprints.filter(
            (t: any) => t.status === "Done"
          ).length;
          const blocked = streamSprints.filter(
            (t: any) => t.status === "Blocked"
          ).length;
          const total = streamSprints.length;

          const streamProgress =
            total === 0
              ? 0
              : Math.round(
                  streamSprints.reduce(
                    (sum: number, sprint: any) =>
                      sum + getProgress(sprint.status),
                    0
                  ) / total
                );

          const streamTheme = getStreamPastelTheme(streamSprints[0]?.streams?.color);

          return (
            <Accordion
              key={streamName}
              expanded={isOpen}
              onChange={(_, expanded) => {
                setOpenStreams((current) =>
                  expanded
                    ? current.includes(streamName)
                      ? current
                      : [...current, streamName]
                    : current.filter((name) => name !== streamName)
                );
              }}
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#ffffff",
                borderRadius: "4px",
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0, mb: 2 },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <AppIcon
                    icon={ChevronDown}
                    size="lg"
                    style={{ color: "#64748b" }}
                  />
                }
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: "#ffffff",
                  "& .MuiAccordionSummary-content": { my: 1.5 },
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    transform: "none",
                    "&.Mui-expanded": { transform: "none" },
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  {/* Stream heading */}
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}
                  >
                    {streamName}
                  </Typography>

                  {/* Progress bar with inline percentage */}
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={streamProgress}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: "9999px",
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: streamTheme.progressBar,
                          borderRadius: "9999px",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", minWidth: 90 }}
                    >
                      {streamProgress}% Complete
                    </Typography>
                  </Stack>

                  {/* Overall sprint stats */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mt: 1.5, alignItems: "center", flexWrap: "wrap" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", fontWeight: 600, mr: 0.5 }}
                    >
                      Overall Sprint Stats
                    </Typography>
                    <SprintStatBadge label="Planned" count={planned} />
                    <SprintStatBadge label="In Progress" count={inProgress} />
                    <SprintStatBadge label="Done" count={done} />
                    <SprintStatBadge label="Blocked" count={blocked} />
                  </Stack>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 3, py: 2, bgcolor: "#f8fafc" }}>
                {streamSprints.map((task: any, index: number) => (
                  <SectionCard
                    key={task.id || index}
                    sx={{
                      p: 0,
                      mb: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Box
                      sx={{
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {task.title || `Sprint ${index + 1}`}
                          </Typography>
                          <Chip
                            label={formatUpdated(task.updated_at || task.created_at)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                          {formatDate(task.start_date)} - {formatDate(task.end_date)}
                        </Typography>

                        <Box sx={{ mt: 2, maxWidth: 440 }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <LinearProgress
                              variant="determinate"
                              value={getProgress(task.status)}
                              sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: "9999px",
                                bgcolor: "#f1f5f9",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: streamTheme.progressBar,
                                  borderRadius: "9999px",
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}
                            >
                              {getProgress(task.status)}%
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack direction="row" sx={{ mt: 1.5, alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                            Release week:
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#0f172a", fontWeight: 600 }}>
                            {getReleaseWeek(task.release_date)}
                          </Typography>
                        </Stack>
                      </Box>

                      <StatusBadge status={task.status} />
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8fafc" }}>
                            {["Phase", "Category", "Resources", "Task", "Feature", "Comments", "Status"].map(
                              (col) => (
                                <TableCell key={col}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                    {col}
                                  </Typography>
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover>
                            <TableCell>{task.phase}</TableCell>
                            <TableCell>{task.category}</TableCell>
                            <TableCell sx={{ maxWidth: 280 }}>
                              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                                {getResourceChips(task.resources).map((resource) => (
                                  <Chip
                                    key={resource}
                                    label={resource}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                  />
                                ))}
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 320 }}>
                              <RichTextDisplay text={task.task} />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 320 }}>
                              <RichTextDisplay text={task.feature} />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 320 }}>
                              <RichTextDisplay text={task.comments} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={task.status} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </SectionCard>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        }
      )}
    </Stack>
  );
}
