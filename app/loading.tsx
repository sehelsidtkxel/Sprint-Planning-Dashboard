import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import BrandLogo from "../components/BrandLogo";

// Placeholder shown while the dashboard data is loading.
export default function Loading() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }} aria-busy="true">
      <Box
        sx={{
          height: 72,
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "#ffffff",
        }}
      >
        <BrandLogo height={24} color="#161616" />
        <Skeleton variant="rounded" width={220} height={38} />
      </Box>

      <Skeleton variant="rectangular" height={240} sx={{ bgcolor: "#e2e8f0" }} />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} variant="rounded" height={64} />
          ))}
        </Box>

        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          {[110, 140, 140, 100].map((width, index) => (
            <Skeleton key={index} variant="text" width={width} height={36} />
          ))}
        </Stack>

        <Stack spacing={2}>
          {[0, 1].map((index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#ffffff",
              }}
            >
              <Skeleton variant="text" width="30%" height={36} />
              <Skeleton variant="text" width="45%" />
              <Skeleton variant="rounded" height={8} sx={{ mt: 2, maxWidth: 440 }} />
              <Skeleton variant="rounded" height={90} sx={{ mt: 3 }} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
