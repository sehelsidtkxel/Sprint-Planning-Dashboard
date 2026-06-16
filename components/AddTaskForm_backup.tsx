"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { UIButton, UIInput } from "./ui";

export default function AddTaskForm() {
  const [form, setForm] = useState({
    phase: "",
    dates: "",
    category: "",
    resources: "",
    task: "",
    feature: "",
    comments: "",
    status: "Planned",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) {
      alert("Saving is unavailable right now.");
      return;
    }

    const { error } = await supabase.from("tasks").insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Task saved successfully");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Task</h2>

      <div className="grid grid-cols-2 gap-4">
        <UIInput
          placeholder="Phase"
          value={form.phase}
          onChange={(e) => setForm({ ...form, phase: e.target.value })}
        />

        <UIInput
          type="date"
          value={form.dates}
          onChange={(e) => setForm({ ...form, dates: e.target.value })}
        />

        <UIInput
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <UIInput
          placeholder="Resource"
          value={form.resources}
          onChange={(e) => setForm({ ...form, resources: e.target.value })}
        />

        <UIInput
          placeholder="Task"
          value={form.task}
          onChange={(e) => setForm({ ...form, task: e.target.value })}
        />

        <UIInput
          placeholder="Feature"
          value={form.feature}
          onChange={(e) => setForm({ ...form, feature: e.target.value })}
        />
      </div>

      <UIInput
        as="textarea"
        className="mt-4"
        rows={4}
        placeholder="Comments"
        value={form.comments}
        onChange={(e) => setForm({ ...form, comments: e.target.value })}
      />

      <select
        className="border rounded px-3 py-2 mt-4 w-full text-sm"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option>Planned</option>
        <option>In Progress</option>
        <option>Done</option>
        <option>Blocked</option>
      </select>

      <UIButton className="mt-6" size="lg" type="submit">
        Save Task
      </UIButton>
    </form>
  );
}