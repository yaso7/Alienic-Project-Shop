import { Suspense } from "react"
import { OrdersTable } from "@/components/admin/orders-table"
import { OrdersHeader } from "@/components/admin/orders-header"
import { OrderDialog } from "@/components/admin/order-dialog"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <OrdersHeader />
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTable />
      </Suspense>
      <OrderDialog />
    </div>
  )
}
