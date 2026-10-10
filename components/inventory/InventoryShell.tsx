import AdminGate from "@/components/admin/AdminGate";
import Nav from "./Nav";

export default function InventoryShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-ivory">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
      </div>
    </AdminGate>
  );
}
