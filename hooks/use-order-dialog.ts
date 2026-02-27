"use client"

import { create } from "zustand"

interface OrderProduct {
  productId: string
  quantity: number
}

interface Order {
  id?: string
  customerName: string
  customerPhone?: string
  customerUsername?: string
  source: "Telegram" | "Instagram" | "Site"
  totalAmount: number
  status: "Pending" | "Confirmed" | "Ready" | "Shipped" | "Delivered" | "Cancelled"
  notes?: string
  estimatedDelivery?: string
  actualDelivery?: string
  products?: OrderProduct[]
}

interface OrderDialogStore {
  isOpen: boolean
  editingOrder: Order | null
  openDialog: (order?: Order) => void
  closeDialog: () => void
}

export const useOrderDialog = create<OrderDialogStore>((set: any) => ({
  isOpen: false,
  editingOrder: null,
  openDialog: (order?: Order) => set({ isOpen: true, editingOrder: order || null }),
  closeDialog: () => set({ isOpen: false, editingOrder: null }),
}))
