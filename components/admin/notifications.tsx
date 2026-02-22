"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

type ContactItem = { id: string; name: string; subject: string; createdAt: string }
type TestimonialItem = { id: string; name: string; rating: number; createdAt: string }

export function Notifications() {
  const router = useRouter()
  const [count, setCount] = useState<number>(0)
  const [messages, setMessages] = useState<ContactItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ type: 'contact' | 'testimonial'; data: ContactItem | TestimonialItem } | null>(null)
  const [itemDetails, setItemDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  async function fetchNotifications() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications', { credentials: 'same-origin' })
      if (!res.ok) return
      const data = await res.json()
      setCount(data.count || 0)
      setMessages(data.newMessages || [])
      setTestimonials(data.pendingTestimonials || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const t = setInterval(fetchNotifications, 15000)
    return () => clearInterval(t)
  }, [])

  async function markRead(id: string) {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', id }),
        credentials: 'same-origin',
      })
      // Remove from both lists
      setMessages(prev => prev.filter(m => m.id !== id))
      setTestimonials(prev => prev.filter(t => t.id !== id))
      setCount(c => Math.max(0, c - 1))
    } catch (e) {
      console.error('mark read error', e)
    }
  }

  async function markAllRead() {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
        credentials: 'same-origin',
      })
      setMessages([])
      setTestimonials([])
      setCount(0)
    } catch (e) {
      console.error('mark all error', e)
    }
  }

  async function approveTestimonial(id: string) {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approveTestimonial', id }),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Failed')
      setTestimonials(prev => prev.filter(t => t.id !== id))
      setCount(c => Math.max(0, c - 1))
      setSelectedItem(null)
    } catch (e) {
      console.error('approve error', e)
    }
  }

  async function rejectTestimonial(id: string) {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rejectTestimonial', id }),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Failed')
      setTestimonials(prev => prev.filter(t => t.id !== id))
      setCount(c => Math.max(0, c - 1))
      setSelectedItem(null)
    } catch (e) {
      console.error('reject error', e)
    }
  }

  async function loadItemDetails(notificationId: string, type: 'contact' | 'testimonial') {
    setLoadingDetails(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, type }),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setItemDetails(data)
    } catch (e) {
      console.error('load details error', e)
    } finally {
      setLoadingDetails(false)
    }
  }

  async function markMessageAsRead(messageId: string) {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markMessageRead', messageId }),
        credentials: 'same-origin',
      })
      setItemDetails(prev => (prev ? { ...prev, status: 'Read' } : null))
    } catch (e) {
      console.error('mark message error', e)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-background">
                {count}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-96" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-foreground">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 && testimonials.length === 0 && (
              <div className="px-2 py-2 text-xs text-muted-foreground">No new notifications</div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedItem({ type: 'contact', data: m })
                  loadItemDetails(m.id, 'contact')
                }}
                className="flex flex-col items-start gap-2 cursor-pointer p-3 hover:bg-accent transition-colors"
              >
                <div className="w-full">
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.subject}</div>
                </div>
                <div className="w-full flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markRead(m.id)
                    }}
                    className="text-xs px-2 py-1 rounded bg-muted text-foreground hover:bg-accent"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            ))}

            {testimonials.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedItem({ type: 'testimonial', data: t })
                  loadItemDetails(t.id, 'testimonial')
                }}
                className="flex flex-col items-start gap-2 cursor-pointer p-3 hover:bg-accent transition-colors"
              >
                <div className="w-full">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">New testimonial — {t.rating}★</div>
                </div>
                <div className="w-full flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      approveTestimonial(t.id)
                    }}
                    className="text-xs px-2 py-1 rounded bg-primary text-background hover:bg-primary/90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      rejectTestimonial(t.id)
                    }}
                    className="text-xs px-2 py-1 rounded bg-muted text-foreground hover:bg-accent"
                  >
                    Reject
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markRead(t.id)
                    }}
                    className="text-xs px-2 py-1 rounded bg-muted text-foreground hover:bg-accent"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/admin/notifications')}>
            View notification history
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => {
        if (!open) {
          setSelectedItem(null)
          setItemDetails(null)
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === 'contact' ? 'Contact Message' : 'Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.type === 'contact'
                ? `From ${itemDetails?.name || selectedItem.data.name}`
                : `${itemDetails?.name || selectedItem?.data.name} · ${itemDetails?.rating || selectedItem?.data.rating}★`}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              {selectedItem?.type === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{itemDetails?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Subject</p>
                    <p className="text-sm text-muted-foreground">{itemDetails?.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Message</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {itemDetails?.message}
                    </p>
                  </div>
                </div>
              )}

              {selectedItem?.type === 'testimonial' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Rating</p>
                    <p className="text-sm text-muted-foreground">{itemDetails?.rating}★</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Testimonial</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {itemDetails?.text}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <DialogFooter className="flex gap-2 justify-end">
            {selectedItem?.type === 'contact' && (
              <Button
                variant={itemDetails?.status === 'Read' ? 'secondary' : 'outline'}
                onClick={() => markMessageAsRead(itemDetails?.id)}
                disabled={itemDetails?.status === 'Read'}
              >
                {itemDetails?.status === 'Read' ? 'Message read' : 'Mark as read'}
              </Button>
            )}
            {selectedItem?.type === 'testimonial' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => rejectTestimonial(selectedItem.data.id)}
                >
                  Reject
                </Button>
                <Button onClick={() => approveTestimonial(selectedItem.data.id)}>
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
