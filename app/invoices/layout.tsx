import InventoryShell from "@/components/inventory/InventoryShell";

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return <InventoryShell>{children}</InventoryShell>;
}
