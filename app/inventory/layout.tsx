import InventoryShell from "@/components/inventory/InventoryShell";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <InventoryShell>{children}</InventoryShell>;
}
