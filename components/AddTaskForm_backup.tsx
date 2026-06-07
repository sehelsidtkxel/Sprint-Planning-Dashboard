"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

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
        <input className="border rounded-lg p-3" placeholder="Phase" value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value })} />

        <input type="date" className="border rounded-lg p-3" value={form.dates} onChange={(e) => setForm({ ...form, dates: e.target.value })} />

        <input className="border rounded-lg p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

        <input className="border rounded-lg p-3" placeholder="Resource" value={form.resources} onChange={(e) => setForm({ ...form, resources: e.target.value })} />

        <input className="border rounded-lg p-3" placeholder="Task" value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} />

        <input className="border rounded-lg p-3" placeholder="Feature" value={form.feature} onChange={(e) => setForm({ ...form, feature: e.target.value })} />
      </div>

      <textarea
        className="border rounded-lg p-3 mt-4 w-full"
        rows={4}
        placeholder="Comments"
        value={form.comments}
        onChange={(e) => setForm({ ...form, comments: e.target.value })}
      />

      <select
        className="border rounded-lg p-3 mt-4 w-full"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option>Planned</option>
        <option>In Progress</option>
        <option>Done</option>
        <option>Blocked</option>
      </select>

      <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
        Save Task
      </button>
    </form>
  );
}