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
    pieceAcquired: string | null
    status: string
    image?: {
      id: string
      url: string
      altText?: string | null
      mimeType?: string | null
    } | null
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
        window.location.reload()
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error("Update failed:", errorData)
        alert(`Failed to update testimonial: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Failed to update testimonial: Network error")
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
              {testimonial.pieceAcquired || "No piece specified"}
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
            {testimonial.image && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Attached Image:</h4>
                <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                  <img
                    src={testimonial.image.url}
                    alt={testimonial.image.altText || `Testimonial image from ${testimonial.name}`}
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
                {testimonial.image.altText && (
                  <p className="text-xs text-muted-foreground italic">
                    Alt text: {testimonial.image.altText}
                  </p>
                )}
              </div>
            )}
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

      <Button
        variant="ghost"
        size="sm"
        onClick={() => updateStatus(testimonial.status === "Approved" ? "Rejected" : "Approved")}
        disabled={loading}
        className={testimonial.status === "Approved" ? "text-red-600" : "text-green-600"}
      >
        {testimonial.status === "Approved" ? <X className="size-4" /> : <Check className="size-4" />}
      </Button>
    </div>
  )
}
