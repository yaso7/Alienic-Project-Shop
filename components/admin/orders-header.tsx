"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrderDialog } from "@/hooks/use-order-dialog"

export function OrdersHeader() {
  const { openDialog } = useOrderDialog()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage orders from Telegram and Instagram
        </p>
      </div>
      <Button onClick={() => openDialog()}>
        <Plus className="mr-2 h-4 w-4" />
        Add Order
      </Button>
    </div>
  )
}
