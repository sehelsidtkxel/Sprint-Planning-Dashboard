import AddSprintForm from "../../components/AddSprintForm";
import SprintList from "../../components/SprintList";
import AdminNav from "../../components/AdminNav";
import AuthGuard from "../../components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminNav />

          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage sprint release details.
            </p>
          </div>

          <AddSprintForm />

          <SprintList />
        </div>
      </main>
    </AuthGuard>
  );
}