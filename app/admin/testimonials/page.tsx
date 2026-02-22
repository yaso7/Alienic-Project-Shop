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
import { TestimonialActions } from '@/components/admin/testimonial-actions'
import { Star } from 'lucide-react'
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  location: string | null
  rating: number
  text: string
  product: { name: string } | null
  status: string
  hasMedia: boolean
}

interface PaginatedResponse {
  testimonials: Testimonial[]
  total: number
  page: number
  pageSize: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState({ pending: 0, approved: 0, rejected: 0 })
  const pageSize = 10

  useEffect(() => {
    fetchTestimonials()
  }, [search, status, page])

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(status && status !== 'all' && { status }),
      })
      const response = await fetch(`/api/admin/testimonials?${params}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        setTestimonials(data.testimonials)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch status counts
    async function fetchStatusCounts() {
      try {
        const pending = await fetch('/api/admin/testimonials?status=Pending&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        const approved = await fetch('/api/admin/testimonials?status=Approved&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        const rejected = await fetch('/api/admin/testimonials?status=Rejected&pageSize=1').then(r =>
          r.json().then(d => d.total || 0)
        )
        setStatusCounts({ pending, approved, rejected })
      } catch (error) {
        console.error('Failed to fetch status counts:', error)
      }
    }
    fetchStatusCounts()
  }, [])

  const handleResetFilters = () => {
    setSearch('')
    setStatus('all')
    setPage(1)
  }

  if (loading && testimonials.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Testimonials
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Moderate reviews and testimonials submitted by visitors
        </p>
        <div className="flex gap-4">
          <Badge variant="outline">
            Pending: {statusCounts.pending}
          </Badge>
          <Badge variant="outline" className="text-green-600">
            Approved: {statusCounts.approved}
          </Badge>
          <Badge variant="outline" className="text-red-600">
            Rejected: {statusCounts.rejected}
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
        placeholder="Search testimonials by name, location, or text..."
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {testimonials.length === 0 && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search || (status && status !== 'all') ? 'No testimonials found matching your filters' : 'No testimonials yet'}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{testimonial.name}</p>
                        {testimonial.location && (
                          <p className="text-xs text-muted-foreground">
                            {testimonial.location}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < testimonial.rating
                                ? 'fill-white text-white'
                                : 'text-gray-400'
                            }
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {testimonial.product?.name || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {testimonial.text}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={testimonial.hasMedia ? "default" : "secondary"}
                        className={testimonial.hasMedia ? "bg-green-600" : ""}
                      >
                        {testimonial.hasMedia ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          testimonial.status === 'Approved'
                            ? 'text-green-600'
                            : testimonial.status === 'Rejected'
                            ? 'text-red-600'
                            : ''
                        }
                      >
                        {testimonial.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TestimonialActions testimonial={testimonial} />
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
