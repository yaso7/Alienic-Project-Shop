"use client"

import Link from "next/link"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "./delete-dialog"

export function ProductActions({ productId, productName, onSuccess }: { 
  productId: string
  productName: string
  onSuccess?: () => void 
}) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="size-4" />
        </Button>
      </Link>
      <DeleteDialog
        id={productId}
        name={productName}
        type="product"
        onSuccess={onSuccess}
      />
    </div>
  )
}
