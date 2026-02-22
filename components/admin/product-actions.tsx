"use client"

import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return

    setDeleting(true)
    try {
      const formData = new FormData()
      formData.append("_method", "DELETE")
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      alert("Failed to delete product")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="size-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  )
}
