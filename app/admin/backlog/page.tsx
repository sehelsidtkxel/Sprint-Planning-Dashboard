"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";
import BacklogManager from "../../../components/BacklogManager";
import FeatureSuggestionAdmin from "../../../components/FeatureSuggestionAdmin";

export default function BacklogPage() {
  const [activeTab, setActiveTab] = useState<"backlog" | "suggestions">(
    "backlog"
  );

  return (
    <AuthGuard>
      <AdminLayout
        title="Backlog Management"
        subtitle="Manage backlog items and review submitted feature suggestions."
      >
        <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: "wrap" }}>
          <Button
            variant={activeTab === "backlog" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveTab("backlog")}
          >
            Backlog Items
          </Button>

          <Button
            variant={activeTab === "suggestions" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveTab("suggestions")}
          >
            Feature Request
          </Button>
        </Stack>

        {activeTab === "backlog" ? (
          <BacklogManager />
        ) : (
          <FeatureSuggestionAdmin />
        )}
      </AdminLayout>
    </AuthGuard>
  );
}