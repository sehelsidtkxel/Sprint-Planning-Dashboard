

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-100">
 
      <div className="max-w-7xl mx-auto p-8">
        {children}
      </div>
    </main>
  );
}