'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProductActions } from '@/components/admin/product-actions'
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  price: string
  collection?: { title: string } | null
  isFeatured: boolean
  isAvailable: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface PaginatedResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  console.log('Products page state:', { products: products.length, total, page, pageSize }) // Debug log

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [search, status, category, page])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories?pageSize=100')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(status && status !== 'all' && { status }),
        ...(category && category !== 'all' && { categoryId: category }),
      })
      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data: PaginatedResponse = await response.json()
        console.log('Products API response:', data) // Debug log
        setProducts(data.products)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setStatus('all')
    setCategory('all')
    setPage(1)
  }

  if (loading && products.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage products displayed in the shop
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 size-4" />
            New Product
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
        placeholder="Search products by name, slug, or material..."
        additionalFilters={
          <div className="flex gap-2">
            <Select value={category} onValueChange={(value) => {
              setCategory(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {products.length === 0 && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search || (status && status !== 'all') || (category && category !== 'all') ? 'No products found matching your filters' : 'No products yet'}
          </p>
          {search || (status && status !== 'all') || (category && category !== 'all') ? (
            <Button onClick={handleResetFilters} variant="outline">
              Clear filters
            </Button>
          ) : (
            <Link href="/admin/products/new">
              <Button variant="outline">Create your first product</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.collection?.title || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {product.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        {product.isAvailable ? (
                          <Badge variant="outline" className="text-green-600">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductActions productId={product.id} />
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
