"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import RichTextField from "./RichTextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SectionCard from "./mui/SectionCard";

type Stream = {
  id: string;
  name: string;
};

export default function AddSprintForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const [form, setForm] = useState({
    stream_id: "",
    title: "",
    start_date: "",
    end_date: "",
    release_date: "",
    phase: "",
    category: "",
    resources: "",
    task: "",
    feature: "",
    comments: "",
    status: "Planned",
  });

  useEffect(() => {
    async function loadStreams() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("streams")
        .select("id, name")
        .order("name");

      if (error) {
        setMessageType("error");
        setMessage(error.message);
        return;
      }

      setStreams(data || []);

      if (data && data.length > 0) {
        setForm((current) => ({
          ...current,
          stream_id: data[0].id,
        }));
      }
    }

    loadStreams();
  }, []);

  function getReleaseWeek(dateValue: string) {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const week = Math.ceil(day / 7);

    const suffix =
      week === 1 ? "1st" :
      week === 2 ? "2nd" :
      week === 3 ? "3rd" : `${week}th`;

    return `${month} ${suffix} week (${date.getFullYear()})`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (!supabase) {
      setMessageType("error");
      setMessage("Saving is unavailable right now.");
      return;
    }

    if (
      !form.stream_id ||
      !form.title.trim() ||
      !form.start_date ||
      !form.end_date ||
      !form.release_date ||
      !form.phase.trim() ||
      !form.category.trim() ||
      !form.resources.trim() ||
      !form.task.trim() ||
      !form.feature.trim() ||
      !form.comments.trim() ||
      !form.status
    ) {
      setMessageType("error");
      setMessage("All fields are required.");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      setMessageType("error");
      setMessage("End Date cannot be before Start Date.");
      return;
    }

    if (new Date(form.release_date) < new Date(form.start_date)) {
      setMessageType("error");
      setMessage("Release Date cannot be before Start Date.");
      return;
    }

    const { error } = await supabase.from("sprints").insert([form]);

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setMessageType("success");
    setMessage("Sprint saved successfully.");

    setForm({
      stream_id: streams[0]?.id || "",
      title: "",
      start_date: "",
      end_date: "",
      release_date: "",
      phase: "",
      category: "",
      resources: "",
      task: "",
      feature: "",
      comments: "",
      status: "Planned",
    });

    router.refresh();

    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    }, 700);
  }

  return (
    <SectionCard>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Add New Sprint
          </Typography>

          {message && (
            <Alert severity={messageType} sx={{ mb: 0.5 }}>
              {message}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
              <TextField
                required
                select
                fullWidth
                label="Stream"
                value={form.stream_id}
                onChange={(e) => setForm({ ...form, stream_id: e.target.value })}
              >
                {streams.map((stream) => (
                  <MenuItem key={stream.id} value={stream.id}>
                    {stream.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                fullWidth
                label="Sprint Name"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <TextField
                required
                fullWidth
                type="date"
                label="Start Date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                required
                fullWidth
                type="date"
                label="End Date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                required
                fullWidth
                type="date"
                label="Release Date"
                value={form.release_date}
                onChange={(e) => setForm({ ...form, release_date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                required
                select
                fullWidth
                label="Phase"
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
              >
                <MenuItem value="">Select Phase</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="QA - Staging">QA - Staging</MenuItem>
                <MenuItem value="QA - UAT Regression">QA - UAT Regression</MenuItem>
              </TextField>

              <TextField
                required
                fullWidth
                slotProps={{ htmlInput: { maxLength: 100 } }}
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />

              <RichTextField
                label="Resources"
                value={form.resources}
                maxLength={1000}
                rows={4}
                onChange={(value) => setForm({ ...form, resources: value })}
              />

              <RichTextField
                label="Task"
                value={form.task}
                maxLength={1000}
                rows={4}
                onChange={(value) => setForm({ ...form, task: value })}
              />

              <RichTextField
                label="Feature"
                value={form.feature}
                maxLength={1000}
                rows={4}
                onChange={(value) => setForm({ ...form, feature: value })}
              />
          </Box>

          {form.release_date && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label="Release week" color="success" variant="outlined" />
              <Chip label={getReleaseWeek(form.release_date)} color="success" />
            </Stack>
          )}

          <TextField
            required
            fullWidth
            multiline
            rows={6}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            label="Comments"
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
          />

          <TextField
            required
            select
            fullWidth
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
            <MenuItem value="Blocked">Blocked</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" color="primary" size="large">
            Save Sprint
          </Button>
        </Stack>
      </Box>
    </SectionCard>
  );
}