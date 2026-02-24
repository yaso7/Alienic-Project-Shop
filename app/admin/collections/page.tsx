'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import { DeleteDialog } from '@/components/admin/delete-dialog'

interface Collection {
  id: string
  title: string
  subtitle: string
  slug: string
  description: string
  mood: string[]
  order: number
  createdAt: Date
}

interface PaginatedResponse {
  collections: Collection[]
  total: number
  page: number
  pageSize: number
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const pageSize = 10

  useEffect(() => {
    fetchCollections()
  }, [search, page, sortBy, sortOrder])

  async function fetchCollections() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      })
      const response = await fetch(`/api/admin/collections?${params}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        setCollections(data.collections)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setLoading(false)
    }
  }

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
    setPage(1)
  }

  const handleSuccess = () => {
    setPage(1)
    fetchCollections()
  }

  if (loading && collections.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Collections
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your collections (displayed on the Projects page)
          </p>
        </div>
        <Link href="/admin/collections/new">
          <Button>
            <Plus className="mr-2 size-4" />
            New Collection
          </Button>
        </Link>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onReset={handleResetFilters}
        placeholder="Search collections by title, subtitle, or description..."
      />

      {collections.length === 0 && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search ? 'No collections found matching your search' : 'No collections yet'}
          </p>
          {search ? (
            <Button onClick={handleResetFilters} variant="outline">
              Clear filters
            </Button>
          ) : (
            <Link href="/admin/collections/new">
              <Button variant="outline">Create your first collection</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      Title
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('order')}>
                    <div className="flex items-center gap-1">
                      Order
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'order' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">
                      Created
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {collection.subtitle}
                    </TableCell>
                    <TableCell>{collection.order}</TableCell>
                    <TableCell className="space-x-1">
                      {collection.mood.map((m) => (
                        <span key={m} className="text-xs bg-accent px-2 py-1 rounded">
                          {m}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(collection.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/collections/${collection.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                          </Button>
                        </Link>
                        <DeleteDialog id={collection.id} name={collection.title} type="collection" onSuccess={handleSuccess} />
                      </div>
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
