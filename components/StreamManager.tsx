"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Stream = {
  id: string;
  name: string;
  color: string;
};

export default function StreamManager() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [editingStream, setEditingStream] = useState<Stream | null>(null);

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

    const { error } = await supabase
      .from("streams")
      .insert([{ name, color }]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setColor("blue");
    loadStreams();
  }

  async function updateStream(e: React.FormEvent) {
    e.preventDefault();

    if (!editingStream) return;

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
    loadStreams();
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

    loadStreams();
  }

  useEffect(() => {
    loadStreams();
  }, []);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">
        Manage Streams
      </h2>

      <form onSubmit={addStream} className="grid grid-cols-3 gap-4 mb-6">
        <input
          className="border rounded-lg p-3"
          placeholder="Stream name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border rounded-lg p-3"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
          <option value="purple">Purple</option>
          <option value="red">Red</option>
        </select>

        <button className="bg-blue-600 text-white rounded-lg font-semibold">
          Add Stream
        </button>
      </form>

      {editingStream && (
        <form
          onSubmit={updateStream}
          className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-lg"
        >
          <input
            className="border rounded-lg p-3"
            value={editingStream.name}
            onChange={(e) =>
              setEditingStream({
                ...editingStream,
                name: e.target.value,
              })
            }
          />

          <select
            className="border rounded-lg p-3"
            value={editingStream.color}
            onChange={(e) =>
              setEditingStream({
                ...editingStream,
                color: e.target.value,
              })
            }
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
          </select>

          <button className="bg-green-600 text-white rounded-lg font-semibold">
            Save Changes
          </button>
        </form>
      )}

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Stream
            </th>
            <th className="p-4 text-left text-xs uppercase text-gray-500">
              Color
            </th>
            <th className="p-4 text-right text-xs uppercase text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {streams.map((stream) => (
            <tr key={stream.id} className="border-t">
              <td className="p-4 font-semibold">
                {stream.name}
              </td>

              <td className="p-4 capitalize">
                {stream.color}
              </td>

              <td className="p-4 text-right space-x-4">
                <button
                  onClick={() => setEditingStream(stream)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteStream(stream.id)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}