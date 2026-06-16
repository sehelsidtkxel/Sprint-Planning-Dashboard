"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import SectionCard from "./mui/SectionCard";
import { Pencil, Trash2 } from "lucide-react";
import { AppIcon } from "./icons";

type Stream = {
  id: string;
  name: string;
  color: string;
};

const colors = ["blue", "green", "orange", "purple", "red"];

function getColorHex(color: string) {
  switch (color) {
    case "green":
      return "#22c55e";
    case "orange":
      return "#f97316";
    case "purple":
      return "#a855f7";
    case "red":
      return "#ef4444";
    default:
      return "#3b82f6";
  }
}

export default function StreamManager() {
  const router = useRouter();

  const [streams, setStreams] = useState<Stream[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [editingStream, setEditingStream] =
    useState<Stream | null>(null);
  const [search, setSearch] = useState("");

  async function loadStreams() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("streams")
      .select("*")
      .order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setStreams(data || []);
  }

  async function addStream(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) return;

    if (!name.trim()) {
      alert("Stream name is required.");
      return;
    }

    const { error } = await supabase
      .from("streams")
      .insert([{ name, color }]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setColor("blue");

    await loadStreams();
    router.refresh();
  }

  async function updateStream(e: React.FormEvent) {
    e.preventDefault();

    if (!editingStream) return;
    if (!supabase) return;

    if (!editingStream.name.trim()) {
      alert("Stream name is required.");
      return;
    }

    const { error } = await supabase
      .from("streams")
      .update({
        name: editingStream.name,
        color: editingStream.color,
      })
      .eq("id", editingStream.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingStream(null);

    await loadStreams();
    router.refresh();
  }

  async function deleteStream(id: string) {
    const confirmDelete = confirm(
      "Are you sure? Deleting a stream may delete linked sprints."
    );

    if (!confirmDelete) return;
    if (!supabase) return;

    const { error } = await supabase
      .from("streams")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadStreams();
    router.refresh();
  }

  useEffect(() => {
    loadStreams();
  }, []);

  const filteredStreams = streams.filter((stream) =>
    stream.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 2,
        }}
      >
        <SectionCard>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
            Total Streams
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
            {streams.length}
          </Typography>
        </SectionCard>

        <SectionCard>
          <Box component="form" onSubmit={editingStream ? updateStream : addStream}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 260px auto" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                required
                fullWidth
                label="Stream name"
                value={editingStream ? editingStream.name : name}
                onChange={(e) =>
                  editingStream
                    ? setEditingStream({
                        ...editingStream,
                        name: e.target.value,
                      })
                    : setName(e.target.value)
                }
              />

              <TextField
                required
                fullWidth
                select
                label="Color"
                value={editingStream ? editingStream.color : color}
                onChange={(e) =>
                  editingStream
                    ? setEditingStream({
                        ...editingStream,
                        color: e.target.value,
                      })
                    : setColor(e.target.value)
                }
              >
                {colors.map((item) => (
                  <MenuItem key={item} value={item}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: getColorHex(item),
                        }}
                      />
                      <span style={{ textTransform: "capitalize" }}>{item}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
                <Button type="submit" variant="contained" color="primary">
                  {editingStream ? "Save Changes" : "Add Stream"}
                </Button>

                {editingStream && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={() => setEditingStream(null)}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </SectionCard>
      </Box>

      <SectionCard sx={{ p: 0, overflow: "hidden" }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Stream List
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredStreams.length} stream(s) found
            </Typography>
          </Box>

          <TextField
            label="Search streams"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>
                  <Typography variant="caption" sx={{ fontWeight: 800 }} color="text.secondary">
                    Stream
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontWeight: 800 }} color="text.secondary">
                    Color
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" sx={{ fontWeight: 800 }} color="text.secondary">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStreams.map((stream) => (
                <TableRow key={stream.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700 }}>{stream.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          bgcolor: getColorHex(stream.color),
                        }}
                      />
                      <Chip
                        size="small"
                        label={stream.color}
                        sx={{ textTransform: "capitalize" }}
                        variant="outlined"
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => setEditingStream(stream)}
                        aria-label="Edit stream"
                      >
                        <AppIcon icon={Pencil} size="md" />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteStream(stream.id)}
                        aria-label="Delete stream"
                        color="error"
                      >
                        <AppIcon icon={Trash2} size="md" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStreams.length === 0 && (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No streams found
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or add a new stream.
            </Typography>
          </Box>
        )}
      </SectionCard>
    </Stack>
  );
}