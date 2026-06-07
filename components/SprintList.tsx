"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import StatusBadge from "./StatusBadge";

type Sprint = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  release_date: string;
  phase: string;
  category: string;
  resources: string;
  task: string;
  feature: string;
  comments: string;
  status: string;
  streams?: {
    name: string;
    color: string;
  };
};

function getReleaseWeek(dateValue?: string) {
  if (!dateValue) return "Not set";

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

export default function SprintList() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  async function loadSprints() {
    const { data, error } = await supabase
      .from("sprints")
      .select(`
        *,
        streams!sprints_stream_id_fkey (
          name,
          color
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setSprints(data || []);
  }

  async function updateSprint(e: React.FormEvent) {
    e.preventDefault();

    if (!editingSprint) return;

    const { id, streams, ...payload } = editingSprint;

    const { error } = await supabase
      .from("sprints")
      .update(payload)
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sprint updated successfully");
    setEditingSprint(null);
    loadSprints();
  }

  async function deleteSprint(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this sprint?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("sprints")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadSprints();
  }

  useEffect(() => {
    loadSprints();
  }, []);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Existing Sprints</h2>

      {editingSprint && (
        <form
          onSubmit={updateSprint}
          className="mb-6 rounded-xl border bg-slate-50 p-5"
        >
          <h3 className="text-xl font-bold mb-4">
            Edit Sprint
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border rounded-lg p-3"
              placeholder="Sprint Name"
              value={editingSprint.title || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  title: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border rounded-lg p-3"
              value={editingSprint.start_date || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  start_date: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border rounded-lg p-3"
              value={editingSprint.end_date || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  end_date: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border rounded-lg p-3"
              value={editingSprint.release_date || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  release_date: e.target.value,
                })
              }
            />

            <select
              className="border rounded-lg p-3"
              value={editingSprint.phase || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  phase: e.target.value,
                })
              }
            >
              <option value="">Select Phase</option>
              <option value="Development">Development</option>
              <option value="QA - Staging">QA - Staging</option>
              <option value="QA - UAT Regression">
                QA - UAT Regression
              </option>
            </select>

            <input
              className="border rounded-lg p-3"
              placeholder="Category"
              value={editingSprint.category || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  category: e.target.value,
                })
              }
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Resources"
              value={editingSprint.resources || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  resources: e.target.value,
                })
              }
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Task"
              value={editingSprint.task || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  task: e.target.value,
                })
              }
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Feature"
              value={editingSprint.feature || ""}
              onChange={(e) =>
                setEditingSprint({
                  ...editingSprint,
                  feature: e.target.value,
                })
              }
            />
          </div>

          <textarea
            className="border rounded-lg p-3 mt-4 w-full"
            rows={3}
            placeholder="Comments"
            value={editingSprint.comments || ""}
            onChange={(e) =>
              setEditingSprint({
                ...editingSprint,
                comments: e.target.value,
              })
            }
          />

          <select
            className="border rounded-lg p-3 mt-4 w-full"
            value={editingSprint.status || "Planned"}
            onChange={(e) =>
              setEditingSprint({
                ...editingSprint,
                status: e.target.value,
              })
            }
          >
            <option>Planned</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Blocked</option>
          </select>

          <div className="flex gap-3 mt-5">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditingSprint(null)}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Sprint
            </th>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Stream
            </th>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Release Week
            </th>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Status
            </th>
            <th className="p-4 text-right text-xs uppercase text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sprints.map((sprint) => (
            <tr key={sprint.id} className="border-t">
              <td className="p-4 font-semibold">{sprint.title}</td>

              <td className="p-4">{sprint.streams?.name || "N/A"}</td>

              <td className="p-4">
                {getReleaseWeek(sprint.release_date)}
              </td>

              <td className="p-4">
                <StatusBadge status={sprint.status} />
              </td>

              <td className="p-4 text-right space-x-4">
                <button
                  onClick={() => setEditingSprint(sprint)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSprint(sprint.id)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sprints.length === 0 && (
        <p className="text-gray-500 mt-4">No sprints found.</p>
      )}
    </div>
  );
}