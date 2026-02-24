'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MessageActions } from '@/components/admin/message-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
  status: string
}

interface PaginatedResponse {
  messages: Message[]
  total: number
  page: number
  pageSize: number
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState({ new: 0, read: 0, archived: 0 })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const pageSize = 10

  useEffect(() => {
    fetchMessages()
  }, [search, status, page, sortBy, sortOrder])

  async function fetchMessages() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(status && status !== 'all' && { status }),
        sortBy,
        sortOrder,
      })
      const response = await fetch(`/api/admin/messages?${params}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        setMessages(data.messages)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch status counts
    async function fetchStatusCounts() {
      try {
        const newCount = await fetch('/api/admin/messages?status=New&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        const readCount = await fetch('/api/admin/messages?status=Read&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        const archivedCount = await fetch('/api/admin/messages?status=Archived&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        setStatusCounts({ new: newCount, read: readCount, archived: archivedCount })
      } catch (error) {
        console.error('Failed to fetch status counts:', error)
      }
    }
    fetchStatusCounts()
  }, [])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setStatus('all')
    setPage(1)
  }

  if (loading && messages.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Messages
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Manage contact form submissions
        </p>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-primary">
            New: {statusCounts.new}
          </Badge>
          <Badge variant="outline">Read: {statusCounts.read}</Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Archived: {statusCounts.archived}
          </Badge>
        </div>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onReset={handleResetFilters}
        placeholder="Search messages by name, email, subject..."
        additionalFilters={
          <Select value={status} onValueChange={(value) => {
            setStatus(value)
            setPage(1)
          }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Read">Read</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {messages.length === 0 && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search || (status && status !== 'all') ? 'No messages found matching your filters' : 'No messages yet'}
          </p>
          {(search || (status && status !== 'all')) && (
            <Button onClick={handleResetFilters} variant="outline">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Name
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('email')}>
                    <div className="flex items-center gap-1">
                      Email
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('subject')}>
                    <div className="flex items-center gap-1">
                      Subject
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'subject' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">
                      Date
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {message.email}
                    </TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm line-clamp-2 text-muted-foreground">
                        {message.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(message.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          message.status === 'New'
                            ? 'text-primary'
                            : message.status === 'Archived'
                            ? 'text-muted-foreground'
                            : ''
                        }
                      >
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <MessageActions message={message} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total > 0 && (
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
