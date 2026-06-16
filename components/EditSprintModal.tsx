"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import RichTextField from "./RichTextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

interface Props {
  sprint: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditSprintModal({
  sprint,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    title: sprint.title || "",
    phase: sprint.phase || "",
    category: sprint.category || "",
    resources: sprint.resources || "",
    task: sprint.task || "",
    feature: sprint.feature || "",
    comments: sprint.comments || "",
    status: sprint.status || "Planned",
    release_date: sprint.release_date || "",
  });

  async function updateSprint() {
    if (!supabase) return;

    const { error } = await supabase
      .from("sprints")
      .update(form)
      .eq("id", sprint.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sprint updated successfully");

    onSaved();
    onClose();
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Sprint</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
              <TextField
                label="Sprint Name"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
              />

              <TextField
                type="date"
                label="Release Date"
                value={form.release_date}
                onChange={(e) =>
                  setForm({ ...form, release_date: e.target.value })
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                select
                label="Phase"
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
                fullWidth
              >
                <MenuItem value="">Select Phase</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="QA - Staging">QA - Staging</MenuItem>
                <MenuItem value="QA - UAT Regression">QA - UAT Regression</MenuItem>
              </TextField>

              <TextField
                slotProps={{ htmlInput: { maxLength: 100 } }}
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                fullWidth
              />

              <RichTextField
                label="Resources"
                value={form.resources}
                maxLength={1000}
                rows={4}
                onChange={(value) =>
                  setForm({ ...form, resources: value })
                }
              />

              <TextField
                multiline
                rows={4}
                slotProps={{ htmlInput: { maxLength: 1000 } }}
                label="Task"
                value={form.task}
                onChange={(e) => setForm({ ...form, task: e.target.value })}
                fullWidth
              />

              <TextField
                multiline
                rows={4}
                slotProps={{ htmlInput: { maxLength: 1000 } }}
                label="Feature"
                value={form.feature}
                onChange={(e) =>
                  setForm({ ...form, feature: e.target.value })
                }
                fullWidth
              />

              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </TextField>
          </Box>

          <TextField
            multiline
            rows={6}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            label="Comments"
            value={form.comments}
            onChange={(e) =>
              setForm({ ...form, comments: e.target.value })
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={updateSprint}>
          Update Sprint
        </Button>
      </DialogActions>
    </Dialog>
  );
}