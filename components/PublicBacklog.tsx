import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SectionCard from "./mui/SectionCard";

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
      {Object.entries(grouped).map(([streamName, items]: any) => (
        <SectionCard key={streamName}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            {streamName}
          </Typography>

          <Stack spacing={1.5}>
            {items.map((item: any) => (
              <Box
                key={item.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 0,
                  p: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.details}
                </Typography>
              </Box>
            ))}
          </Stack>
        </SectionCard>
      ))}
    </Stack>
  );
}
