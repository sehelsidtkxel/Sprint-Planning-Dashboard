import StreamManager from "../../../components/StreamManager";
import AdminNav from "../../../components/AdminNav";

export default function StreamsAdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminNav />
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h1 className="text-4xl font-bold">
            Stream Management
          </h1>

          <p className="text-gray-500 mt-2">
            Add, edit and delete release streams.
          </p>
        </div>

        <StreamManager />
      </div>
    </main>
  );
}