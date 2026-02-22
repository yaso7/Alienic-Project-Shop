"use client"

import { Button } from "@/components/ui/button"
import { Eye, Archive, Mail, Trash } from "lucide-react"
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

interface MessageActionsProps {
  message: {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    createdAt: Date
  }
}

export function MessageActions({ message }: MessageActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: "Read" | "Archived") {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to update message")
      }
    } catch (error) {
      alert("Failed to update message")
    } finally {
      setLoading(false)
    }
  }

  async function deleteMessage() {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete message")
      }
    } catch (error) {
      alert("Failed to delete message")
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
            <DialogTitle>{message.subject}</DialogTitle>
            <DialogDescription>
              From: {message.name} ({message.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Date
              </p>
              <p className="text-sm">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Message
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              {message.status === "New" && (
                <Button
                  onClick={() => updateStatus("Read")}
                  disabled={loading}
                  size="sm"
                >
                  <Mail className="mr-2 size-4" />
                  Mark as Read
                </Button>
              )}
              {message.status !== "Archived" && (
                <Button
                  onClick={() => updateStatus("Archived")}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <Archive className="mr-2 size-4" />
                  Archive
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant="ghost"
        size="sm"
        onClick={deleteMessage}
        disabled={loading}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="size-4" />
      </Button>
    </div>
  )
}
