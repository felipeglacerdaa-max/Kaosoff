import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</div>
    </div>
  );
}
