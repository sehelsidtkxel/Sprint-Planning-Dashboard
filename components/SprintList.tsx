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

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SprintList() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [search, setSearch] = useState("");

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

  const totalSprints = sprints.length;
const plannedCount = sprints.filter((s) => s.status === "Planned").length;
const inProgressCount = sprints.filter((s) => s.status === "In Progress").length;
const doneCount = sprints.filter((s) => s.status === "Done").length;
const blockedCount = sprints.filter((s) => s.status === "Blocked").length;

  const filteredSprints = sprints.filter((sprint) => {
    const query = search.toLowerCase();

    if (!query) return true;

    return (
      sprint.title?.toLowerCase().includes(query) ||
      sprint.status?.toLowerCase().includes(query) ||
      sprint.phase?.toLowerCase().includes(query) ||
      sprint.streams?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
  <div className="bg-white rounded-2xl border shadow-sm p-5">
    <p className="text-sm text-slate-500 font-semibold">Total Sprints</p>
    <h3 className="text-3xl font-bold mt-2">{totalSprints}</h3>
  </div>

  <div className="bg-white rounded-2xl border shadow-sm p-5">
    <p className="text-sm text-slate-500 font-semibold">Planned</p>
    <h3 className="text-3xl font-bold mt-2 text-yellow-600">{plannedCount}</h3>
  </div>

  <div className="bg-white rounded-2xl border shadow-sm p-5">
    <p className="text-sm text-slate-500 font-semibold">In Progress</p>
    <h3 className="text-3xl font-bold mt-2 text-blue-600">{inProgressCount}</h3>
  </div>

  <div className="bg-white rounded-2xl border shadow-sm p-5">
    <p className="text-sm text-slate-500 font-semibold">Done</p>
    <h3 className="text-3xl font-bold mt-2 text-green-600">{doneCount}</h3>
  </div>

  <div className="bg-white rounded-2xl border shadow-sm p-5">
    <p className="text-sm text-slate-500 font-semibold">Blocked</p>
    <h3 className="text-3xl font-bold mt-2 text-red-600">{blockedCount}</h3>
  </div>
</div>
      {editingSprint && (
        <form
          onSubmit={updateSprint}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Edit Sprint
              </h3>

              <p className="text-slate-500 mt-1">
                Update sprint release information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditingSprint(null)}
              className="text-slate-500 hover:text-slate-900 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              required
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

            <select
              required
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
              required
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
              required
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
              required
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
              required
              className="border rounded-lg p-3"
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

            <input
              required
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
              required
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

            <textarea
              required
              rows={4}
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

            <textarea
              required
              rows={4}
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
            required
            className="border rounded-lg p-3 mt-4 w-full"
            rows={4}
            placeholder="Comments"
            value={editingSprint.comments || ""}
            onChange={(e) =>
              setEditingSprint({
                ...editingSprint,
                comments: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-3 mt-6 border-t pt-5">
            <button
              type="button"
              onClick={() => setEditingSprint(null)}
              className="bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold">
              Save Changes
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Sprint List
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredSprints.length} sprint(s) found
            </p>
          </div>

          <input
            className="border rounded-xl px-4 py-3 w-80"
            placeholder="Search sprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Sprint
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Stream
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Phase
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Dates
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Release
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs uppercase font-bold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredSprints.map((sprint) => (
              <tr
                key={sprint.id}
                className="border-b last:border-b-0 hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {sprint.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {sprint.category || "No category"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {sprint.streams?.name || "N/A"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {sprint.phase || "-"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  <div>{formatDate(sprint.start_date)}</div>
                  <div className="text-xs text-slate-400">
                    to {formatDate(sprint.end_date)}
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {getReleaseWeek(sprint.release_date)}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={sprint.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditingSprint(sprint)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSprint(sprint.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSprints.length === 0 && (
          <div className="p-10 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              No sprints found
            </h3>

            <p className="text-slate-500 mt-2">
              Try adjusting your search or add a new sprint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}