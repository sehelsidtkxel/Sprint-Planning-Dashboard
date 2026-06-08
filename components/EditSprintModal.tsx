"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import RichTextField from "./RichTextField";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          Edit Sprint
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3"
            value={form.title}
            placeholder="Sprint Name"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            type="date"
            className="border rounded-lg p-3"
            value={form.release_date}
            onChange={(e) =>
              setForm({
                ...form,
                release_date: e.target.value,
              })
            }
          />

          <select
            className="border rounded-lg p-3"
            value={form.phase}
            onChange={(e) =>
              setForm({ ...form, phase: e.target.value })
            }
          >
            <option value="">Select Phase</option>
            <option>Development</option>
            <option>QA - Staging</option>
            <option>QA - UAT Regression</option>
          </select>

          <input
            maxLength={100}
            className="border rounded-lg p-3"
            value={form.category}
            placeholder="Category"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <div>
            <RichTextField
  label="Resources"
  value={form.resources}
  maxLength={1000}
  rows={4}
  onChange={(value) =>
    setForm({ ...form, resources: value })
  }
/>
            <p className="text-xs text-gray-400 text-right">
              {form.resources.length}/500
            </p>
          </div>

          <div>
            <textarea
              rows={4}
              maxLength={1000}
              className="border rounded-lg p-3 w-full"
              value={form.task}
              placeholder="Task"
              onChange={(e) =>
                setForm({ ...form, task: e.target.value })
              }
            />

            <p className="text-xs text-gray-400 text-right">
              {form.task.length}/1000
            </p>
          </div>

          <div>
            <textarea
              rows={4}
              maxLength={1000}
              className="border rounded-lg p-3 w-full"
              value={form.feature}
              placeholder="Feature"
              onChange={(e) =>
                setForm({ ...form, feature: e.target.value })
              }
            />

            <p className="text-xs text-gray-400 text-right">
              {form.feature.length}/1000
            </p>
          </div>

          <select
            className="border rounded-lg p-3"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option>Planned</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="mt-4">
          <textarea
            rows={6}
            maxLength={2000}
            className="border rounded-lg p-3 w-full"
            value={form.comments}
            placeholder="Comments"
            onChange={(e) =>
              setForm({
                ...form,
                comments: e.target.value,
              })
            }
          />

          <p className="text-xs text-gray-400 text-right">
            {form.comments.length}/2000
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-3 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={updateSprint}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg"
          >
            Update Sprint
          </button>
        </div>
      </div>
    </div>
  );
}