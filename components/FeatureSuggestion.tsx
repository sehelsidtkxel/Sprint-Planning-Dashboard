"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { AppIcon } from "./icons";
import { supabase } from "../lib/supabase";

const featureImpacts = [
  "Increase Revenue",
  "Reduce Cost",
  "Strategic / Fundamental",
];

const FORM_ID = "feature-suggestion-form";
const DRAWER_WIDTH = 480;

export default function FeatureSuggestion({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [title, setTitle] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [featureImpact, setFeatureImpact] = useState("");
  const [impactValue, setImpactValue] = useState("");
  const [logicalReasoning, setLogicalReasoning] = useState("");
  const [solution, setSolution] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);

  function resetForm() {
    setRequesterName("");
    setRequesterEmail("");
    setTitle("");
    setRequirementsText("");
    setFeatureImpact("");
    setImpactValue("");
    setLogicalReasoning("");
    setSolution("");
    setMessage("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) {
      setMessageType("error");
      setMessage("Submission is unavailable right now.");
      return;
    }

    const needsImpactValue =
      featureImpact === "Increase Revenue" ||
      featureImpact === "Reduce Cost";

    const needsLogicalReasoning =
      needsImpactValue && impactValue.trim().length > 0;

    if (
      !requesterName.trim() ||
      !requesterEmail.trim() ||
      !title.trim() ||
      !requirementsText.trim() ||
      !featureImpact ||
      (needsImpactValue && !impactValue.trim()) ||
      (needsLogicalReasoning && !logicalReasoning.trim()) ||
      !solution.trim()
    ) {
      setMessageType("error");
      setMessage("Please complete all fields.");
      return;
    }

    const { error } = await supabase.from("feature_suggestions").insert([
      {
        requester_name: requesterName,
        requester_email: requesterEmail,
        title,
        details: requirementsText,
        feature_impact: featureImpact,
        impact_value: needsImpactValue ? impactValue : null,
        logical_reasoning: needsLogicalReasoning ? logicalReasoning : null,
        requirements: solution,
      },
    ]);

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    resetForm();

    setMessageType("success");
    setMessage("Feature request submitted successfully.");

    setTimeout(() => {
      onSubmitted?.();
      onClose();
    }, 1500);
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: DRAWER_WIDTH },
            maxWidth: "100%",
            borderRadius: 0,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Add feature request
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <AppIcon icon={X} size="sm" />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2,
          }}
        >
          {message && (
            <Alert severity={messageType} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component="form" id={FORM_ID} onSubmit={submitSuggestion}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Requester Name"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
              />

              <TextField
                required
                fullWidth
                type="email"
                label="Requester Email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
              />

              <TextField
                required
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                required
                fullWidth
                multiline
                rows={4}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
                label="Requirements"
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
              />

              <TextField
                required
                fullWidth
                select
                label="Feature Impact"
                value={featureImpact}
                onChange={(e) => {
                  setFeatureImpact(e.target.value);
                  setImpactValue("");
                  setLogicalReasoning("");
                }}
              >
                <MenuItem value="">Select Feature Impact</MenuItem>
                {featureImpacts.map((impact) => (
                  <MenuItem key={impact} value={impact}>
                    {impact}
                  </MenuItem>
                ))}
              </TextField>

              {featureImpact === "Increase Revenue" && (
                <TextField
                  required
                  fullWidth
                  label="Revenue Impact Value"
                  value={impactValue}
                  onChange={(e) => {
                    setImpactValue(e.target.value);
                    setLogicalReasoning("");
                  }}
                />
              )}

              {featureImpact === "Reduce Cost" && (
                <TextField
                  required
                  fullWidth
                  label="Cost Saving Value"
                  value={impactValue}
                  onChange={(e) => {
                    setImpactValue(e.target.value);
                    setLogicalReasoning("");
                  }}
                />
              )}

              {(featureImpact === "Increase Revenue" ||
                featureImpact === "Reduce Cost") &&
                impactValue.trim() && (
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    slotProps={{ htmlInput: { maxLength: 2000 } }}
                    label="Logical Reasoning"
                    value={logicalReasoning}
                    onChange={(e) => setLogicalReasoning(e.target.value)}
                  />
                )}

              <TextField
                required
                fullWidth
                multiline
                rows={5}
                slotProps={{ htmlInput: { maxLength: 3000 } }}
                label="Solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "right" }}
              >
                {solution.length}/3000
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            py: 2,
          }}
        >
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            variant="contained"
            color="primary"
          >
            Submit feature request
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
