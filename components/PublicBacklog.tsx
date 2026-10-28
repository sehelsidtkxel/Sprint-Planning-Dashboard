import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CalendarDays } from "lucide-react";
import SectionCard from "./mui/SectionCard";
import RichTextDisplay from "./RichTextDisplay";
import { AppIcon } from "./icons";
import { getStreamPastelTheme } from "./TaskTable";
import { formatLocalDate } from "../lib/dates";

// Items with a release date come first (soonest first); undated items last.
function compareByReleaseDate(a: any, b: any) {
  if (!a.target_date && !b.target_date) return 0;
  if (!a.target_date) return 1;
  if (!b.target_date) return -1;

  return String(a.target_date).localeCompare(String(b.target_date));
}

export default function PublicBacklog({
  backlogItems,
}: {
  backlogItems: any[];
}) {
  const grouped = backlogItems.reduce((acc: any, item: any) => {
    const streamName = item.streams?.name || "Unassigned";

    if (!acc[streamName]) {
      acc[streamName] = [];
    }

    acc[streamName].push(item);

    return acc;
  }, {});

  if (!backlogItems.length) {
    return (
      <SectionCard sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          No backlog items found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Backlog items will appear here once added by the admin team.
        </Typography>
      </SectionCard>
    );
  }

  return (
    <Stack spacing={3}>
      {Object.entries(grouped).map(([streamName, items]: any) => {
        const streamTheme = getStreamPastelTheme(items[0]?.streams?.color);
        const sortedItems = [...items].sort(compareByReleaseDate);

        return (
          <SectionCard key={streamName} sx={{ p: 0, overflow: "hidden" }}>
            {/* Stream header */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "#ffffff",
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: streamTheme.accent,
                  flexShrink: 0,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {streamName}
              </Typography>
              <Box
                component="span"
                sx={{
                  px: 1.25,
                  py: 0.25,
                  borderRadius: "9999px",
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </Box>
            </Stack>

            {/* Backlog items */}
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {sortedItems.map((item: any) => (
                <Box
                  component="li"
                  key={item.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 200px" },
                    gap: { xs: 1.5, md: 4 },
                    px: 3,
                    py: 2.5,
                    bgcolor: "#ffffff",
                    "&:not(:last-of-type)": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}
                    >
                      {item.title}
                    </Typography>
                    {item.details && (
                      <Box
                        sx={{
                          mt: 0.75,
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <RichTextDisplay text={item.details} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#64748b",
                      }}
                    >
                      Release date
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{
                        mt: 0.5,
                        alignItems: "center",
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        color: item.target_date ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      <AppIcon icon={CalendarDays} size="sm" />
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "inherit" }}>
                        {item.target_date
                          ? formatLocalDate(item.target_date)
                          : "Not scheduled"}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>
        );
      })}
    </Stack>
  );
}
