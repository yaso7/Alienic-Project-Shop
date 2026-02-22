"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TestimonialActionsProps {
  testimonial: {
    id: string
    name: string
    location: string | null
    rating: number
    text: string
    product: { name: string } | null
    status: string
  }
}

export function TestimonialActions({ testimonial }: TestimonialActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: "Approved" | "Rejected") {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to update testimonial")
      }
    } catch (error) {
      alert("Failed to update testimonial")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{testimonial.name}</DialogTitle>
            <DialogDescription>
              {testimonial.location && `${testimonial.location} • `}
              {testimonial.product?.name || "No product"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < testimonial.rating ? "text-primary" : "text-border"}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed">{testimonial.text}</p>
            <div className="flex gap-2 pt-4">
              {testimonial.status !== "Approved" && (
                <Button
                  onClick={() => updateStatus("Approved")}
                  disabled={loading}
                  size="sm"
                >
                  <Check className="mr-2 size-4" />
                  Approve
                </Button>
              )}
              {testimonial.status !== "Rejected" && (
                <Button
                  onClick={() => updateStatus("Rejected")}
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                >
                  <X className="mr-2 size-4" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {testimonial.status === "Pending" && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStatus("Approved")}
            disabled={loading}
            className="text-green-600"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateStatus("Rejected")}
            disabled={loading}
            className="text-red-600"
          >
            <X className="size-4" />
          </Button>
        </>
      )}
    </div>
  )
}
