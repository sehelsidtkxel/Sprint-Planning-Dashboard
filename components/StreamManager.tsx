"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Stream = {
  id: string;
  name: string;
  color: string;
};

const colors = ["blue", "green", "orange", "purple", "red"];

function getColorPreview(color: string) {
  switch (color) {
    case "green":
      return "bg-green-600";
    case "orange":
      return "bg-orange-500";
    case "purple":
      return "bg-purple-600";
    case "red":
      return "bg-red-600";
    default:
      return "bg-blue-600";
  }
}

export default function StreamManager() {
  const router = useRouter();

  const [streams, setStreams] = useState<Stream[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [editingStream, setEditingStream] =
    useState<Stream | null>(null);
  const [search, setSearch] = useState("");

  async function loadStreams() {
    const { data, error } = await supabase
      .from("streams")
      .select("*")
      .order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setStreams(data || []);
  }

  async function addStream(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Stream name is required.");
      return;
    }

    const { error } = await supabase
      .from("streams")
      .insert([{ name, color }]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setColor("blue");

    await loadStreams();
    router.refresh();
  }

  async function updateStream(e: React.FormEvent) {
    e.preventDefault();

    if (!editingStream) return;

    if (!editingStream.name.trim()) {
      alert("Stream name is required.");
      return;
    }

    const { error } = await supabase
      .from("streams")
      .update({
        name: editingStream.name,
        color: editingStream.color,
      })
      .eq("id", editingStream.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingStream(null);

    await loadStreams();
    router.refresh();
  }

  async function deleteStream(id: string) {
    const confirmDelete = confirm(
      "Are you sure? Deleting a stream may delete linked sprints."
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("streams")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadStreams();
    router.refresh();
  }

  useEffect(() => {
    loadStreams();
  }, []);

  const filteredStreams = streams.filter((stream) =>
    stream.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Total Streams
          </p>
          <h3 className="text-3xl font-bold mt-2">
            {streams.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5 col-span-3">
          <form
            onSubmit={editingStream ? updateStream : addStream}
            className="grid grid-cols-3 gap-4"
          >
            <input
              required
              className="border rounded-xl px-4 py-3"
              placeholder="Stream name"
              value={editingStream ? editingStream.name : name}
              onChange={(e) =>
                editingStream
                  ? setEditingStream({
                      ...editingStream,
                      name: e.target.value,
                    })
                  : setName(e.target.value)
              }
            />

            <select
              required
              className="border rounded-xl px-4 py-3 capitalize"
              value={editingStream ? editingStream.color : color}
              onChange={(e) =>
                editingStream
                  ? setEditingStream({
                      ...editingStream,
                      color: e.target.value,
                    })
                  : setColor(e.target.value)
              }
            >
              {colors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                className={`text-white px-5 py-3 rounded-xl font-semibold ${
                  editingStream ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {editingStream ? "Save Changes" : "+ Add Stream"}
              </button>

              {editingStream && (
                <button
                  type="button"
                  onClick={() => setEditingStream(null)}
                  className="bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Stream List
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredStreams.length} stream(s) found
            </p>
          </div>

          <input
            className="border rounded-xl px-4 py-3 w-80"
            placeholder="Search streams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Stream
              </th>

              <th className="px-5 py-4 text-left text-xs uppercase font-bold text-slate-500">
                Color
              </th>

              <th className="px-5 py-4 text-right text-xs uppercase font-bold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredStreams.map((stream) => (
              <tr
                key={stream.id}
                className="border-b last:border-b-0 hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {stream.name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full ${getColorPreview(
                        stream.color
                      )}`}
                    />

                    <span className="capitalize text-sm text-slate-600">
                      {stream.color}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditingStream(stream)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteStream(stream.id)}
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

        {filteredStreams.length === 0 && (
          <div className="p-10 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              No streams found
            </h3>

            <p className="text-slate-500 mt-2">
              Try adjusting your search or add a new stream.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}