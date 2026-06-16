"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RichTextField from "./RichTextField";
import RichTextDisplay from "./RichTextDisplay";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SectionCard from "./mui/SectionCard";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { AppIcon } from "./icons";

type Stream = {
  id: string;
  name: string;
};

type BacklogItem = {
  id: string;
  stream_id: string;
  title: string;
  details: string;
  status: string;
};

export default function BacklogManager() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [items, setItems] = useState<Record<string, BacklogItem[]>>({});
  const [openStreams, setOpenStreams] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
const [showForm, setShowForm] = useState(false);
  async function loadStreams() {
    if (!supabase) return;

    const { data } = await supabase
      .from("streams")
      .select("*")
      .order("name");

    setStreams(data || []);

    if (data?.length && !selectedStream) {
      setSelectedStream(data[0].id);
    }

    if (data?.length) {
      setOpenStreams(data.map((stream) => stream.id));
    }
  }

  async function loadBacklog() {
    if (!supabase) return;

    const { data } = await supabase
      .from("backlog_items")
      .select(`
        *,
        streams (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    const grouped: Record<string, BacklogItem[]> = {};

    data?.forEach((item: any) => {
      if (!grouped[item.stream_id]) {
        grouped[item.stream_id] = [];
      }

      grouped[item.stream_id].push(item);
    });

    setItems(grouped);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) return;

    if (!selectedStream || !title.trim() || !details.trim()) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase.from("backlog_items").insert([
      {
        stream_id: selectedStream,
        title,
        details,
        status: "Backlog",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDetails("");
    setShowForm(false);

    loadBacklog();
  }

  function startEdit(item: BacklogItem) {
    setEditingItem(item);
    setSelectedStream(item.stream_id);
    setTitle(item.title);
    setDetails(item.details);
setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function updateItem(e: React.FormEvent) {
    e.preventDefault();

    if (!editingItem) return;
    if (!supabase) return;

    if (!selectedStream || !title.trim() || !details.trim()) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase
      .from("backlog_items")
      .update({
        stream_id: selectedStream,
        title,
        details,
      })
      .eq("id", editingItem.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingItem(null);
    setTitle("");
    setDetails("");

    loadBacklog();
  }

  function cancelEdit() {
    setEditingItem(null);
    setTitle("");
    setDetails("");
  }

  async function deleteItem(id: string) {
    const confirmDelete = confirm("Delete this backlog item?");

    if (!confirmDelete) return;

    if (!supabase) return;

    await supabase.from("backlog_items").delete().eq("id", id);

    loadBacklog();
  }

  function toggleStream(id: string) {
    setOpenStreams((current) =>
      current.includes(id)
        ? current.filter((streamId) => streamId !== id)
        : [...current, id]
    );
  }

  useEffect(() => {
    loadStreams();
    loadBacklog();
  }, []);

  const totalBacklogItems = Object.values(items).flat().length;
  const totalStreams = streams.length;

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <SectionCard>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
            Total Backlog Items
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            {totalBacklogItems}
          </Typography>
        </SectionCard>

        <SectionCard>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
            Streams
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            {totalStreams}
          </Typography>
        </SectionCard>
      </Box>

      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Backlog Item"}
        </Button>
      </Stack>

      {showForm && (
        <SectionCard>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {editingItem ? "Edit Backlog Item" : "Create Backlog Item"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Manage backlog items for each release stream.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={editingItem ? updateItem : addItem}
          >
            <Stack spacing={2}>
              <TextField
                required
                select
                label="Stream"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
              >
                {streams.map((stream) => (
                  <MenuItem key={stream.id} value={stream.id}>
                    {stream.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                label="Backlog item title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <RichTextField
                label="Backlog Details"
                value={details}
                rows={5}
                maxLength={2000}
                onChange={setDetails}
              />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                {editingItem && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}

                <Button type="submit" variant="contained" color="primary">
                  {editingItem ? "Update Backlog Item" : "Add Backlog Item"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </SectionCard>
      )}

      <Stack spacing={2}>
        {streams.map((stream) => {
          const streamItems = items[stream.id] || [];
          const isOpen = openStreams.includes(stream.id);

          return (
            <SectionCard key={stream.id} sx={{ p: 0, overflow: "hidden" }}>
              <Button
                fullWidth
                variant="text"
                color="primary"
                onClick={() => toggleStream(stream.id)}
                sx={{
                  justifyContent: "space-between",
                  px: 3,
                  py: 2.5,
                  bgcolor: "grey.50",
                  borderRadius: 0,
                  textTransform: "none",
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 800 }}>
                    {stream.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {streamItems.length} backlog item(s)
                  </Typography>
                </Box>

                <AppIcon
                  icon={isOpen ? ChevronDown : ChevronRight}
                  size="lg"
                  style={{ color: "rgba(100, 116, 139, 1)" }}
                />
              </Button>

              {isOpen && (
                <Box sx={{ p: 3 }}>
                  {!streamItems.length ? (
                    <Box
                      sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography color="text.secondary">
                        No backlog items for this stream.
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {streamItems.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            p: 2.5,
                            bgcolor: "background.paper",
                            "&:hover": { bgcolor: "grey.50" },
                          }}
                        >
                          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                            <Box sx={{ flex: 1 }}>
                              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                  {item.title}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={item.status || "Backlog"}
                                  color="primary"
                                  variant="outlined"
                                />
                              </Stack>

                              <Box sx={{ mt: 1.5, color: "text.secondary" }}>
                                <RichTextDisplay text={item.details} />
                              </Box>
                            </Box>

                              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <IconButton onClick={() => startEdit(item)} aria-label="Edit item">
                                <AppIcon icon={Pencil} size="md" />
                              </IconButton>
                              <IconButton
                                onClick={() => deleteItem(item.id)}
                                aria-label="Delete item"
                                color="error"
                              >
                                <AppIcon icon={Trash2} size="md" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </SectionCard>
          );
        })}
      </Stack>
    </Stack>
  );
}