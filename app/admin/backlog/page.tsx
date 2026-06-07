import AdminNav from "../../../components/AdminNav";
import AuthGuard from "../../../components/AuthGuard";
import BacklogManager from "../../../components/BacklogManager";

export default function BacklogPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminNav />

          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h1 className="text-4xl font-bold">Backlog</h1>
            <p className="text-gray-500 mt-2">
              Manage backlog tasks by stream.
            </p>
          </div>

          <BacklogManager />
        </div>
      </main>
    </AuthGuard>
  );
}