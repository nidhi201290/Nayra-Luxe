import AdminGate from '@/components/admin/AdminGate';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="flex bg-ivory">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AdminGate>
  );
}
