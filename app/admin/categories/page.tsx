'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Edit, Plus } from 'lucide-react'
import { CategoryDialog } from '@/components/admin/category-dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
}

interface PaginatedResponse {
  categories: Category[]
  total: number
  page: number
  pageSize: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchCategories()
  }, [search, page])

  async function fetchCategories() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await fetch(`/api/admin/categories?${params}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        setCategories(data.categories)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setPage(1)
    fetchCategories()
  }

  const handleResetFilters = () => {
    setSearch('')
    setPage(1)
  }

  if (loading && categories.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories
          </p>
        </div>
        <CategoryDialog trigger={<Button><Plus className="mr-2 size-4" />New Category</Button>} onSuccess={handleSuccess} />
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onReset={handleResetFilters}
        placeholder="Search categories by name, slug, or description..."
      />

      {categories.length === 0 && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search ? 'No categories found matching your search' : 'No categories yet'}
          </p>
          {search ? (
            <Button onClick={handleResetFilters} variant="outline">
              Clear filters
            </Button>
          ) : (
            <CategoryDialog trigger={<Button variant="outline">Create your first category</Button>} onSuccess={handleSuccess} />
          )}
        </div>
      ) : (
        <>
          <div className="border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(category.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <CategoryDialog
                          category={category}
                          trigger={<Button variant="ghost" size="sm"><Edit className="size-4" /></Button>}
                          onSuccess={handleSuccess}
                        />
                        <DeleteDialog id={category.id} name={category.name} type="category" onSuccess={handleSuccess} />
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
