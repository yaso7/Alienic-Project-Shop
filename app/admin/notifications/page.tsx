'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TablePagination } from '@/components/admin/table-pagination'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  isRead: boolean
  createdAt: string
}

interface PaginatedResponse {
  notifications: Notification[]
  total: number
  page: number
  pageSize: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchNotifications()
  }, [page])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const offset = (page - 1) * pageSize
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: pageSize, offset }),
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading && notifications.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Notification History</h1>
        </div>
        {unreadCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-lg border border-border bg-card">
        {notifications.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    notification.isRead
                      ? 'hover:bg-accent/50'
                      : 'bg-accent/30 hover:bg-accent/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {notification.title || `${notification.type} notification`}
                        </h3>
                        {!notification.isRead && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      {notification.body && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {notification.body}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {total > 0 && (
              <div className="border-t border-border p-4">
                <TablePagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
