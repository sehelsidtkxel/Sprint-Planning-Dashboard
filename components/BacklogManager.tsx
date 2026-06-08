"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RichTextField from "./RichTextField";
import RichTextDisplay from "./RichTextDisplay";


type Stream = {
  id: string;
  name: string;
};

type BacklogItem = {
  id: string;
  stream_id: string;
  title: string;
  details: string;
  status: string;
};

export default function BacklogManager() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [items, setItems] = useState<Record<string, BacklogItem[]>>({});

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);

  async function loadStreams() {
    const { data } = await supabase
      .from("streams")
      .select("*")
      .order("name");

    setStreams(data || []);

    if (data?.length && !selectedStream) {
      setSelectedStream(data[0].id);
    }
  }

  async function loadBacklog() {
    const { data } = await supabase
      .from("backlog_items")
      .select(`
        *,
        streams (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    const grouped: Record<string, BacklogItem[]> = {};

    data?.forEach((item: any) => {
      if (!grouped[item.stream_id]) {
        grouped[item.stream_id] = [];
      }

      grouped[item.stream_id].push(item);
    });

    setItems(grouped);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedStream || !title.trim() || !details.trim()) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase
      .from("backlog_items")
      .insert([
        {
          stream_id: selectedStream,
          title,
          details,
          status: "Backlog",
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDetails("");

    loadBacklog();
  }

  function startEdit(item: BacklogItem) {
    setEditingItem(item);
    setSelectedStream(item.stream_id);
    setTitle(item.title);
    setDetails(item.details);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function updateItem(e: React.FormEvent) {
    e.preventDefault();

    if (!editingItem) return;

    if (!selectedStream || !title.trim() || !details.trim()) {
      alert("All fields are required.");
      return;
    }

    const { error } = await supabase
      .from("backlog_items")
      .update({
        stream_id: selectedStream,
        title,
        details,
      })
      .eq("id", editingItem.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingItem(null);
    setTitle("");
    setDetails("");

    loadBacklog();
  }

  function cancelEdit() {
    setEditingItem(null);
    setTitle("");
    setDetails("");
  }

  async function deleteItem(id: string) {
    const confirmDelete = confirm("Delete this backlog item?");

    if (!confirmDelete) return;

    await supabase
      .from("backlog_items")
      .delete()
      .eq("id", id);

    loadBacklog();
  }

  useEffect(() => {
    loadStreams();
    loadBacklog();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingItem ? "Edit Backlog Item" : "Add Backlog Item"}
        </h2>

        <form
          onSubmit={editingItem ? updateItem : addItem}
          className="space-y-4"
        >
          <select
            required
            className="border rounded-lg p-3 w-full"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            {streams.map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.name}
              </option>
            ))}
          </select>

          <input
            required
            className="border rounded-lg p-3 w-full"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <RichTextField
  label="Task Details"
  value={details}
  rows={5}
  maxLength={2000}
  onChange={setDetails}
/>

          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
              {editingItem ? "Update Backlog Task" : "Add Backlog Task"}
            </button>

            {editingItem && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {streams.map((stream) => (
        <div
          key={stream.id}
          className="bg-white rounded-xl border shadow-sm p-6"
        >
          <h3 className="text-2xl font-bold mb-4">
            {stream.name}
          </h3>

          {!items[stream.id]?.length ? (
            <p className="text-gray-500">
              No backlog items.
            </p>
          ) : (
            <div className="space-y-3">
              {items[stream.id].map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold">
                      {item.title}
                    </h4>

                    <div className="text-gray-600 mt-1">
  <RichTextDisplay text={item.details} />
</div>

                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}