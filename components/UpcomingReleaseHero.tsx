import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

function formatDate(dateString?: string) {
  if (!dateString) return "Not set";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysRemaining(dateString?: string) {
  if (!dateString) return null;

  const today = new Date();
  const releaseDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  releaseDate.setHours(0, 0, 0, 0);

  const diff = releaseDate.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function UpcomingReleaseHero({
  tasks,
}: {
  tasks: any[];
}) {
  const upcoming = tasks
    .filter((task) => task.release_date)
    .filter((task) => new Date(task.release_date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() -
        new Date(b.release_date).getTime()
    )[0];

  if (!upcoming) {
    return null;
  }

  const daysRemaining = getDaysRemaining(upcoming.release_date);

  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #3730a3 100%)",
        color: "white",
        borderRadius: 0,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: "64px" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#bfdbfe",
                fontWeight: 600,
              }}
            >
              Upcoming release
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Typography
                sx={{ fontSize: "34px", fontWeight: 700, lineHeight: 1.2, color: "white" }}
              >
                {upcoming.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "34px",
                  color: "#bfdbfe",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {upcoming.streams?.name || "Unassigned Stream"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={`Phase: ${upcoming.phase}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
                  fontWeight: 600,
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
              <Chip
                label={`Status: ${upcoming.status}`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
                  fontWeight: 600,
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              color: "white",
              borderRadius: "16px",
              px: 2.5,
              py: 1.5,
              minWidth: 190,
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "rgba(191, 219, 254, 0.95)" }}
            >
              Release Date
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, color: "white" }}>
              {formatDate(upcoming.release_date)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, mt: 0.5, color: "#bfdbfe" }}
            >
              {daysRemaining === 0
                ? "Releasing Today"
                : `${daysRemaining} days remaining`}
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
