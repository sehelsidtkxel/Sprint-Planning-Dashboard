"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import AddSprintForm from "../../components/AddSprintForm";
import SprintList from "../../components/SprintList";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AuthGuard>
      <AdminLayout
        title="Sprint Management"
        subtitle="Create, edit, and manage sprint release details."
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "← Back to List" : "+ Add Sprint"}
          </Button>
        }
      >
        {showForm ? (
          <AddSprintForm onSuccess={() => setShowForm(false)} />
        ) : (
          <SprintList />
        )}
      </AdminLayout>
    </AuthGuard>
  );
}