"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Trash2 } from "lucide-react";
import { AppIcon } from "./icons";
import { supabase } from "../lib/supabase";
import { UIButton, UIInput } from "./ui";

type Suggestion = {
  id: string;
  requester_name: string;
  requester_email: string;
  title: string;
  details: string;
  application?: string | null;
  feature_impact: string;
  impact_value?: string | null;
  logical_reasoning?: string | null;
  requirements: string;
  status: string;
};

type Stream = {
  id: string;
  name: string;
};

type Notice = {
  type: "success" | "error";
  text: string;
};

// The submission form stores "Requirements" in `details` and "Solution" in
// `requirements`; the backlog item keeps all of it under clear headings.
function buildBacklogDetails(item: Suggestion) {
  const sections = [
    item.details,
    item.requirements && `**Solution**\n${item.requirements}`,
    item.feature_impact && `**Feature Impact:** ${item.feature_impact}`,
    item.impact_value && `**Impact Value:** ${item.impact_value}`,
    item.logical_reasoning && `**Logical Reasoning**\n${item.logical_reasoning}`,
    `**Requested by:** ${item.requester_name} (${item.requester_email})`,
  ];

  return sections.filter(Boolean).join("\n\n");
}

function getStatusStyle(status?: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function FeatureSuggestionAdmin() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);

  const [approvingItem, setApprovingItem] = useState<Suggestion | null>(null);
  const [approveStreamId, setApproveStreamId] = useState("");
  const [approveReleaseDate, setApproveReleaseDate] = useState("");
  const [approveError, setApproveError] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTargets, setDeleteTargets] = useState<Suggestion[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadSuggestions() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("feature_suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setNotice({ type: "error", text: `Could not load feature requests: ${error.message}` });
      return;
    }

    const loaded: Suggestion[] = data || [];
    setSuggestions(loaded);
    setSelectedIds((current) =>
      current.filter((id) => loaded.some((item) => item.id === id))
    );
  }

  async function loadStreams() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("streams")
      .select("id, name")
      .order("name");

    if (error) {
      setNotice({ type: "error", text: `Could not load streams: ${error.message}` });
      return;
    }

    setStreams(data || []);
  }

  function openApproveDialog(item: Suggestion) {
    // Preselect a stream only when an older request names one exactly.
    const match = streams.find(
      (stream) =>
        item.application &&
        stream.name.toLowerCase() === item.application.toLowerCase()
    );

    setApprovingItem(item);
    setApproveStreamId(match?.id || "");
    setApproveReleaseDate("");
    setApproveError("");
  }

  function closeApproveDialog() {
    if (saving) return;
    setApprovingItem(null);
  }

  async function approveSuggestion() {
    if (!supabase || !approvingItem) return;

    if (!approveStreamId || !approveReleaseDate) {
      setApproveError("Please choose a stream and a release date.");
      return;
    }

    setSaving(true);
    setApproveError("");

    const { data: backlogItem, error: backlogError } = await supabase
      .from("backlog_items")
      .insert([
        {
          stream_id: approveStreamId,
          title: approvingItem.title,
          details: buildBacklogDetails(approvingItem),
          target_date: approveReleaseDate,
          status: "Backlog",
        },
      ])
      .select("id")
      .single();

    if (backlogError || !backlogItem) {
      setSaving(false);
      setApproveError(
        `Could not add the backlog item: ${backlogError?.message || "unknown error"}`
      );
      return;
    }

    const { error: statusError } = await supabase
      .from("feature_suggestions")
      .update({ status: "Approved" })
      .eq("id", approvingItem.id);

    if (statusError) {
      // Undo the backlog item so the request is not half-approved.
      await supabase.from("backlog_items").delete().eq("id", backlogItem.id);
      setSaving(false);
      setApproveError(
        `Could not mark the request as approved, so nothing was saved: ${statusError.message}`
      );
      return;
    }

    const streamName =
      streams.find((stream) => stream.id === approveStreamId)?.name || "the";

    setSaving(false);
    setApprovingItem(null);
    setNotice({
      type: "success",
      text: `"${approvingItem.title}" was approved and added to the ${streamName} backlog.`,
    });
    loadSuggestions();
  }

  async function rejectSuggestion(item: Suggestion) {
    if (!supabase) return;
    if (!confirm(`Reject "${item.title}"?`)) return;

    const { error } = await supabase
      .from("feature_suggestions")
      .update({ status: "Rejected" })
      .eq("id", item.id);

    if (error) {
      setNotice({ type: "error", text: `Could not reject the request: ${error.message}` });
      return;
    }

    setNotice({ type: "success", text: `"${item.title}" was rejected.` });
    loadSuggestions();
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }

  function closeDeleteDialog() {
    if (deleting) return;
    setDeleteTargets(null);
  }

  async function confirmDelete() {
    if (!supabase || !deleteTargets?.length) return;

    const ids = deleteTargets.map((item) => item.id);
    setDeleting(true);

    // Supabase reports no error when row-level security blocks a delete; it
    // just deletes nothing, so compare the returned rows with what was asked.
    const { data, error } = await supabase
      .from("feature_suggestions")
      .delete()
      .in("id", ids)
      .select("id");

    setDeleting(false);
    setDeleteTargets(null);

    if (error) {
      setNotice({ type: "error", text: `Could not delete: ${error.message}` });
      return;
    }

    const deletedIds = (data || []).map((row: { id: string }) => row.id);
    setSelectedIds((current) => current.filter((id) => !deletedIds.includes(id)));

    if (deletedIds.length < ids.length) {
      setNotice({
        type: "error",
        text: `Only ${deletedIds.length} of ${ids.length} feature request(s) were deleted. Your database security settings may not allow deleting feature requests.`,
      });
    } else {
      setNotice({
        type: "success",
        text:
          ids.length === 1
            ? `"${deleteTargets[0].title}" was deleted.`
            : `${ids.length} feature requests deleted.`,
      });
    }

    loadSuggestions();
  }

  useEffect(() => {
    loadSuggestions();
    loadStreams();
  }, []);

  const pendingCount = suggestions.filter(
    (item) => !item.status || item.status === "Pending"
  ).length;

  const approvedCount = suggestions.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = suggestions.filter(
    (item) => item.status === "Rejected"
  ).length;

  const filteredSuggestions = suggestions.filter((item) => {
    const currentStatus = item.status || "Pending";
    const query = search.toLowerCase();

    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;

    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.requester_name?.toLowerCase().includes(query) ||
      item.requester_email?.toLowerCase().includes(query) ||
      item.application?.toLowerCase().includes(query) ||
      item.feature_impact?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const allVisibleSelected =
    filteredSuggestions.length > 0 &&
    filteredSuggestions.every((item) => selectedIds.includes(item.id));

  function toggleSelectAllVisible() {
    const visibleIds = filteredSuggestions.map((item) => item.id);

    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds]))
    );
  }

  const selectedSuggestions = suggestions.filter((item) =>
    selectedIds.includes(item.id)
  );

  return (
    <div className="space-y-6">
      {notice && (
        <Alert severity={notice.type} onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Total Suggestions
          </p>
          <h3 className="text-3xl font-bold mt-2">
            {suggestions.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Pending
          </p>
          <h3 className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingCount}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Approved
          </p>
          <h3 className="text-3xl font-bold mt-2 text-green-600">
            {approvedCount}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm text-slate-500 font-semibold">
            Rejected
          </p>
          <h3 className="text-3xl font-bold mt-2 text-red-600">
            {rejectedCount}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Submitted Feature Suggestions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredSuggestions.length} request(s) found
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="border border-slate-300 rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | "Pending"
                    | "Approved"
                    | "Rejected"
                )
              }
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <div className="w-80">
              <UIInput
              placeholder="Search suggestions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-b bg-slate-50 flex items-center justify-between gap-4 flex-wrap min-h-[56px]">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-slate-900 cursor-pointer"
              checked={allVisibleSelected}
              onChange={toggleSelectAllVisible}
              disabled={filteredSuggestions.length === 0}
            />
            Select all shown ({filteredSuggestions.length})
          </label>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                {selectedIds.length} selected
              </span>
              <UIButton
                variant="danger"
                size="sm"
                onClick={() => setDeleteTargets(selectedSuggestions)}
              >
                <AppIcon icon={Trash2} size="sm" />
                Delete selected
              </UIButton>
              <UIButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Clear
              </UIButton>
            </div>
          )}
        </div>

        <div className="divide-y">
          {filteredSuggestions.map((item) => {
            const currentStatus = item.status || "Pending";

            return (
              <div
                key={item.id}
                className={`p-6 transition ${
                  selectedIds.includes(item.id) ? "bg-blue-50/60" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between gap-6">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.title}`}
                    className="mt-2 h-4 w-4 shrink-0 accent-slate-900 cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelected(item.id)}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          currentStatus
                        )}`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {item.requester_name} · {item.requester_email}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-500">
                        Requirements
                      </p>
                      <p className="mt-1 text-slate-700 whitespace-pre-wrap">
                        {item.details}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                      {item.application && (
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <p className="text-xs font-bold text-slate-500">
                            Application
                          </p>
                          <p className="font-semibold mt-1">
                            {item.application}
                          </p>
                        </div>
                      )}

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Feature Impact
                        </p>
                        <p className="font-semibold mt-1">
                          {item.feature_impact || "-"}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Impact Value
                        </p>
                        <p className="font-semibold mt-1">
                          {item.impact_value || "-"}
                        </p>
                      </div>
                    </div>

                    {item.logical_reasoning && (
                      <div className="mt-5 bg-slate-50 p-4 rounded-xl">
                        <p className="text-xs font-bold text-slate-500">
                          Logical Reasoning
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-slate-700">
                          {item.logical_reasoning}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-500">
                        Solution
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {item.requirements}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 w-28">
                    {currentStatus === "Pending" && (
                      <>
                        <UIButton
                          onClick={() => openApproveDialog(item)}
                          variant="primary"
                          className="bg-green-600 hover:bg-green-700 focus:ring-green-100"
                        >
                          Approve
                        </UIButton>

                        <UIButton
                          onClick={() => rejectSuggestion(item)}
                          variant="danger"
                        >
                          Reject
                        </UIButton>
                      </>
                    )}

                    <UIButton
                      onClick={() => setDeleteTargets([item])}
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <AppIcon icon={Trash2} size="sm" />
                      Delete
                    </UIButton>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSuggestions.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-xl font-bold text-slate-800">
                No feature suggestions found
              </h3>

              <p className="text-slate-500 mt-2">
                Try adjusting your search or status filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(approvingItem)}
        onClose={closeApproveDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Approve feature request</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <Typography color="text.secondary">
              <strong>{approvingItem?.title}</strong> will be added to the
              backlog of the stream you choose.
            </Typography>

            {approveError && <Alert severity="error">{approveError}</Alert>}

            <TextField
              required
              select
              fullWidth
              label="Stream"
              value={approveStreamId}
              onChange={(e) => setApproveStreamId(e.target.value)}
              disabled={saving}
              helperText={streams.length === 0 ? "No streams found. Add one under Streams first." : " "}
            >
              {streams.map((stream) => (
                <MenuItem key={stream.id} value={stream.id}>
                  {stream.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              type="date"
              label="Release Date"
              value={approveReleaseDate}
              onChange={(e) => setApproveReleaseDate(e.target.value)}
              disabled={saving}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeApproveDialog} disabled={saving} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={approveSuggestion}
            disabled={saving || !approveStreamId || !approveReleaseDate}
          >
            {saving ? "Approving..." : "Approve & add to backlog"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTargets)}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {deleteTargets?.length === 1
            ? "Delete feature request?"
            : `Delete ${deleteTargets?.length} feature requests?`}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={1.5}>
            <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.primary" }}>
              {deleteTargets?.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                </li>
              ))}
            </Box>
            {deleteTargets && deleteTargets.length > 5 && (
              <Typography color="text.secondary">
                and {deleteTargets.length - 5} more
              </Typography>
            )}
            <Typography color="text.secondary">
              This can&apos;t be undone. Backlog items created from approved
              requests are not deleted.
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}