"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Stream = {
  id: string;
  name: string;
};

type BacklogItem = {
  id: string;
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
      `);

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

  async function deleteItem(id: string) {
    const confirmDelete = confirm(
      "Delete this backlog item?"
    );

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
          Add Backlog Item
        </h2>

        <form
          onSubmit={addItem}
          className="space-y-4"
        >
          <select
            className="border rounded-lg p-3 w-full"
            value={selectedStream}
            onChange={(e) =>
              setSelectedStream(e.target.value)
            }
          >
            {streams.map((stream) => (
              <option
                key={stream.id}
                value={stream.id}
              >
                {stream.name}
              </option>
            ))}
          </select>

          <input
            className="border rounded-lg p-3 w-full"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            rows={5}
            className="border rounded-lg p-3 w-full"
            placeholder="Task details"
            value={details}
            onChange={(e) =>
              setDetails(e.target.value)
            }
          />

          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
            Add Backlog Task
          </button>
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
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-bold">
                      {item.title}
                    </h4>

                    <p className="text-gray-600 mt-1">
                      {item.details}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      deleteItem(item.id)
                    }
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}