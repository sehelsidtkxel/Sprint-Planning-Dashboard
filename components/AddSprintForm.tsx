"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Stream = {
  id: string;
  name: string;
};

export default function AddSprintForm() {
  const router = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);

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
      const { data, error } = await supabase
        .from("streams")
        .select("id, name")
        .order("name");

      if (error) {
        alert(error.message);
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
      alert("All fields are required.");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    if (new Date(form.release_date) < new Date(form.start_date)) {
      alert("Release Date cannot be before Start Date.");
      return;
    }

    const { error } = await supabase.from("sprints").insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sprint saved successfully");

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
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Add New Sprint</h2>

      <div className="grid grid-cols-2 gap-4">
        <select
          required
          className="border rounded-lg p-3"
          value={form.stream_id}
          onChange={(e) =>
            setForm({ ...form, stream_id: e.target.value })
          }
        >
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>

        <input
          required
          className="border rounded-lg p-3"
          placeholder="Sprint Name"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          required
          type="date"
          className="border rounded-lg p-3"
          value={form.start_date}
          onChange={(e) =>
            setForm({ ...form, start_date: e.target.value })
          }
        />

        <input
          required
          type="date"
          className="border rounded-lg p-3"
          value={form.end_date}
          onChange={(e) =>
            setForm({ ...form, end_date: e.target.value })
          }
        />

        <input
          required
          type="date"
          className="border rounded-lg p-3"
          value={form.release_date}
          onChange={(e) =>
            setForm({ ...form, release_date: e.target.value })
          }
        />

        <select
          required
          className="border rounded-lg p-3"
          value={form.phase}
          onChange={(e) =>
            setForm({ ...form, phase: e.target.value })
          }
        >
          <option value="">Select Phase</option>
          <option value="Development">Development</option>
          <option value="QA - Staging">QA - Staging</option>
          <option value="QA - UAT Regression">QA - UAT Regression</option>
        </select>

        <input
          required
          maxLength={100}
          className="border rounded-lg p-3"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <div>
          <textarea
            required
            rows={3}
            maxLength={500}
            className="border rounded-lg p-3 w-full"
            placeholder="Resources"
            value={form.resources}
            onChange={(e) =>
              setForm({ ...form, resources: e.target.value })
            }
          />

          <p className="text-xs text-gray-400 text-right">
            {form.resources.length}/500
          </p>
        </div>

        <div>
          <textarea
            required
            rows={4}
            maxLength={1000}
            className="border rounded-lg p-3 w-full"
            placeholder="Task"
            value={form.task}
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
            required
            rows={4}
            maxLength={1000}
            className="border rounded-lg p-3 w-full"
            placeholder="Feature"
            value={form.feature}
            onChange={(e) =>
              setForm({ ...form, feature: e.target.value })
            }
          />

          <p className="text-xs text-gray-400 text-right">
            {form.feature.length}/1000
          </p>
        </div>
      </div>

      {form.release_date && (
        <div className="mt-4 inline-flex overflow-hidden rounded-xl border border-green-700 shadow-sm">
          <div className="bg-green-100 text-green-700 px-4 py-2 font-bold">
            📅 RELEASE WEEK
          </div>

          <div className="bg-green-700 text-white px-5 py-2 font-bold">
            {getReleaseWeek(form.release_date)}
          </div>
        </div>
      )}

      <div className="mt-4">
        <textarea
          required
          rows={6}
          maxLength={2000}
          className="border rounded-lg p-3 w-full"
          placeholder="Comments"
          value={form.comments}
          onChange={(e) =>
            setForm({ ...form, comments: e.target.value })
          }
        />

        <p className="text-xs text-gray-400 text-right">
          {form.comments.length}/2000
        </p>
      </div>

      <select
        required
        className="border rounded-lg p-3 mt-4 w-full"
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

      <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
        Save Sprint
      </button>
    </form>
  );
}