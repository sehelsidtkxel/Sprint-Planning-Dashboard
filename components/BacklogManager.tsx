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
  const [openStreams, setOpenStreams] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
const [showForm, setShowForm] = useState(false);
  async function loadStreams() {
    const { data } = await supabase
      .from("streams")
      .select("*")
      .order("name");

    setStreams(data || []);

    if (data?.length && !selectedStream) {
      setSelectedStream(data[0].id);
    }

    if (data?.length) {
      setOpenStreams(data.map((stream) => stream.id));
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

    const { error } = await supabase.from("backlog_items").insert([
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
    setShowForm(false);

    loadBacklog();
  }

  function startEdit(item: BacklogItem) {
    setEditingItem(item);
    setSelectedStream(item.stream_id);
    setTitle(item.title);
    setDetails(item.details);
setShowForm(true);

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

    await supabase.from("backlog_items").delete().eq("id", id);

    loadBacklog();
  }

  function toggleStream(id: string) {
    setOpenStreams((current) =>
      current.includes(id)
        ? current.filter((streamId) => streamId !== id)
        : [...current, id]
    );
  }

  useEffect(() => {
    loadStreams();
    loadBacklog();
  }, []);

  const totalBacklogItems = Object.values(items).flat().length;
  const totalStreams = streams.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Total Backlog Items
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {totalBacklogItems}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Streams
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {totalStreams}
          </h3>
        </div>
      </div>

      <div className="flex justify-end">
  <button
    type="button"
    onClick={() => setShowForm(!showForm)}
    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
  >
    {showForm ? "Close Form" : "+ Add Backlog Item"}
  </button>
</div>

{showForm && (
  <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingItem ? "Edit Backlog Item" : "Create Backlog Item"}
          </h2>

          <p className="text-slate-500 mt-1">
            Manage backlog items for each release stream.
          </p>
        </div>

        <form
          onSubmit={editingItem ? updateItem : addItem}
          className="space-y-4"
        >
          <select
            required
            className="border rounded-xl p-3 w-full"
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
            className="border rounded-xl p-3 w-full"
            placeholder="Backlog item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <RichTextField
            label="Backlog Details"
            value={details}
            rows={5}
            maxLength={2000}
            onChange={setDetails}
          />

          <div className="flex justify-end gap-3 border-t pt-5">
            {editingItem && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            )}

            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
              {editingItem ? "Update Backlog Item" : "+ Add Backlog Item"}
            </button>
          </div>
        </form>
</div>
)}

      <div className="space-y-4">
        {streams.map((stream) => {
          const streamItems = items[stream.id] || [];
          const isOpen = openStreams.includes(stream.id);

          return (
            <div
              key={stream.id}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleStream(stream.id)}
                className="w-full px-6 py-5 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-900">
                    {stream.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {streamItems.length} backlog item(s)
                  </p>
                </div>

                <span className="text-xl text-slate-500">
                  {isOpen ? "▼" : "▶"}
                </span>
              </button>

              {isOpen && (
                <div className="p-6">
                  {!streamItems.length ? (
                    <div className="rounded-xl border border-dashed p-6 text-center">
                      <p className="text-slate-500">
                        No backlog items for this stream.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {streamItems.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-xl p-5 hover:bg-slate-50 transition"
                        >
                          <div className="flex justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-lg text-slate-900">
                                  {item.title}
                                </h4>

                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  {item.status || "Backlog"}
                                </span>
                              </div>

                              <div className="mt-3 text-slate-600">
                                <RichTextDisplay text={item.details} />
                              </div>
                            </div>

                            <div className="flex gap-3 shrink-0">
                              <button
                                onClick={() => startEdit(item)}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}