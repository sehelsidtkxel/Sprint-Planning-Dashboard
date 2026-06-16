import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function PageShell({
  children,
  maxWidth = "xl",
}: {
  children: React.ReactNode;
  maxWidth?: "lg" | "xl" | false;
}) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth={maxWidth} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
