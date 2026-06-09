import StreamManager from "../../../components/StreamManager";
import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";

export default function StreamsAdminPage() {
  return (
    <AuthGuard>
      <AdminLayout
        title="Stream Management"
        subtitle="Add, edit, and manage release streams."
      >
        <StreamManager />
      </AdminLayout>
    </AuthGuard>
  );
}