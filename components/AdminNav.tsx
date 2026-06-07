import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 mb-6 flex gap-4">
      <Link
        href="/admin"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
      >
        Sprints
      </Link>

      <Link
        href="/admin/streams"
        className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-semibold"
      >
        Streams
      </Link>

      <Link
        href="/"
        className="ml-auto bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold"
      >
        View Dashboard
      </Link>
    </div>
  );
}