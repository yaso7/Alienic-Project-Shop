'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
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
import { TableFilters } from '@/components/admin/table-filters'
import { TablePagination } from '@/components/admin/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface MysteryBox {
  id: number
  title: string
  bundleSize: "Small" | "Medium" | "Large"
  design: "Simple" | "Extra" | "IDontCare"
  stylePreference: "Masculine" | "Feminine" | "IDontCare"
  neckMeasurements?: string | null
  wristMeasurements?: string | null
  colorPreference?: string | null
  notes?: string | null
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"
  username?: string | null
  price: string | number
  createdAt: Date
  updatedAt: Date
}

interface PaginatedResponse {
  success: boolean
  data: {
    mysteryBoxes: MysteryBox[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export default function MysteryBoxesPage() {
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [bundleSize, setBundleSize] = useState<string>('all')
  const [design, setDesign] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMysteryBox, setEditingMysteryBox] = useState<MysteryBox | null>(null)
  
  // Pricing logic from the website
  const bundleSizePrices = {
    Small: 10,
    Medium: 15,
    Large: 30
  }

  const designPrices = {
    Simple: 0,
    Extra: 10,
    IDontCare: 5
  }

  const basePrice = 0
  
  const [formData, setFormData] = useState<{
    title: string
    bundleSize: "Small" | "Medium" | "Large"
    design: "Simple" | "Extra" | "IDontCare"
    stylePreference: "Masculine" | "Feminine" | "IDontCare"
    neckMeasurements: string
    wristMeasurements: string
    colorPreference: string
    notes: string
    username: string
    price: string
    status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"
  }>({
    title: '',
    bundleSize: 'Small',
    design: 'Simple',
    stylePreference: 'IDontCare',
    neckMeasurements: '',
    wristMeasurements: '',
    colorPreference: '',
    notes: '',
    username: '',
    price: bundleSizePrices['Small'].toString(),
    status: 'Pending',
  })
  
  // Calculate price based on bundle size and design
  const calculatedPrice = basePrice + bundleSizePrices[formData.bundleSize] + designPrices[formData.design]
  
  // Update price when bundle size or design changes
  useEffect(() => {
    const newPrice = basePrice + bundleSizePrices[formData.bundleSize] + designPrices[formData.design]
    setFormData(prev => ({ ...prev, price: newPrice.toString() }))
  }, [formData.bundleSize, formData.design])

  const pageSize = 10

  useEffect(() => {
    fetchMysteryBoxes()
  }, [search, status, bundleSize, design, page, sortBy, sortOrder])

  async function fetchMysteryBoxes() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(status && status !== 'all' && { status }),
        ...(bundleSize && bundleSize !== 'all' && { bundleSize }),
        ...(design && design !== 'all' && { design }),
        sortBy,
        sortOrder,
      })
      const response = await fetch(`/api/admin/mystery-boxes?${params}`)
      if (response.ok) {
        const result = await response.json()
        console.log('API response:', result)
        if (result.success && result.data) {
          console.log('Mystery boxes from API:', result.data.mysteryBoxes)
          setMysteryBoxes(result.data.mysteryBoxes || [])
          setTotal(result.data.total || 0)
        } else {
          setMysteryBoxes([])
          setTotal(0)
        }
      } else {
        setMysteryBoxes([])
        setTotal(0)
      }
    } catch (error) {
      console.error('Failed to fetch mystery boxes:', error)
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
    setStatus('all')
    setBundleSize('all')
    setDesign('all')
    setPage(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingMysteryBox && (!editingMysteryBox.id || isNaN(editingMysteryBox.id))) {
        alert('Invalid mystery box ID. Please try again.')
        return
      }
      
      const url = editingMysteryBox 
        ? `/api/admin/mystery-boxes/${editingMysteryBox.id}`
        : '/api/admin/mystery-boxes'
      
      const method = editingMysteryBox ? 'PUT' : 'POST'
      
      console.log('Editing mystery box ID:', editingMysteryBox?.id)
      console.log('Request URL:', url)
      console.log('Request method:', method)
      
      const submitData = {
          ...formData,
          price: parseFloat(formData.price) || 0,
        }
        
        console.log('Submitting data:', submitData)
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        })

      if (response.ok) {
        const result = await response.json()
        console.log('Update successful:', result)
        fetchMysteryBoxes()
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        setEditingMysteryBox(null)
        setFormData({
          title: '',
          bundleSize: 'Small',
          design: 'Simple',
          stylePreference: 'IDontCare',
          neckMeasurements: '',
          wristMeasurements: '',
          colorPreference: '',
          notes: '',
          username: '',
          price: bundleSizePrices['Small'].toString(),
          status: 'Pending',
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Update failed:', response.status, errorData)
        alert(`Failed to ${editingMysteryBox ? 'update' : 'create'} mystery box: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to save mystery box:', error)
    }
  }

  const handleEdit = (mysteryBox: MysteryBox) => {
    console.log('Editing mystery box:', mysteryBox)
    setEditingMysteryBox(mysteryBox)
    setFormData({
      title: mysteryBox.title,
      bundleSize: mysteryBox.bundleSize,
      design: mysteryBox.design,
      stylePreference: mysteryBox.stylePreference,
      neckMeasurements: mysteryBox.neckMeasurements || '',
      wristMeasurements: mysteryBox.wristMeasurements || '',
      colorPreference: mysteryBox.colorPreference || '',
      notes: mysteryBox.notes || '',
      username: mysteryBox.username || '',
      price: typeof mysteryBox.price === 'string' ? mysteryBox.price : mysteryBox.price.toString(),
      status: mysteryBox.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mystery box?')) return
    
    try {
      const response = await fetch(`/api/admin/mystery-boxes/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Delete successful:', result)
        fetchMysteryBoxes()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Delete failed:', response.status, errorData)
        alert(`Failed to delete mystery box: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete mystery box:', error)
    }
  }

  if (loading && (!mysteryBoxes || mysteryBoxes.length === 0)) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mystery Boxes
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage mystery box orders and configurations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Mystery Box Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Mystery Box Order</DialogTitle>
              <DialogDescription>
                Add a new mystery box order to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bundle Size</Label>
                    <Select value={formData.bundleSize} onValueChange={(value: "Small" | "Medium" | "Large") => setFormData(prev => ({ ...prev, bundleSize: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Design</Label>
                    <Select value={formData.design} onValueChange={(value: "Simple" | "Extra" | "IDontCare") => setFormData(prev => ({ ...prev, design: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Extra">Extra</SelectItem>
                        <SelectItem value="IDontCare">I don't care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Style Preference</Label>
                    <Select value={formData.stylePreference} onValueChange={(value: "Masculine" | "Feminine" | "IDontCare") => setFormData(prev => ({ ...prev, stylePreference: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculine">Masculine</SelectItem>
                        <SelectItem value="Feminine">Feminine</SelectItem>
                        <SelectItem value="IDontCare">I don't care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neckMeasurements">Neck Measurements</Label>
                    <Input
                      id="neckMeasurements"
                      value={formData.neckMeasurements}
                      onChange={(e) => setFormData(prev => ({ ...prev, neckMeasurements: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wristMeasurements">Wrist Measurements</Label>
                    <Input
                      id="wristMeasurements"
                      value={formData.wristMeasurements}
                      onChange={(e) => setFormData(prev => ({ ...prev, wristMeasurements: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Auto-calculated)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      ${bundleSizePrices[formData.bundleSize]} (Bundle) + ${designPrices[formData.design]} (Design) = ${calculatedPrice}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colorPreference">Color Preference</Label>
                  <Input
                    id="colorPreference"
                    value={formData.colorPreference}
                    onChange={(e) => setFormData(prev => ({ ...prev, colorPreference: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled") => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Mystery Box Order</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onReset={handleResetFilters}
        placeholder="Search mystery boxes by title, username..."
        additionalFilters={
          <div className="flex gap-2 flex-wrap">
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
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bundleSize} onValueChange={(value) => {
              setBundleSize(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Bundle size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
            <Select value={design} onValueChange={(value) => {
              setDesign(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All designs</SelectItem>
                <SelectItem value="Simple">Simple</SelectItem>
                <SelectItem value="Extra">Extra</SelectItem>
                <SelectItem value="IDontCare">I don't care</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {(!mysteryBoxes || mysteryBoxes.length === 0) && !loading ? (
        <div className="text-center py-12 border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            {search || 
             (status && status !== 'all') || 
             (bundleSize && bundleSize !== 'all') || 
             (design && design !== 'all') 
             ? 'No mystery boxes found matching your filters' : 'No mystery boxes yet'}
          </p>
          {search || 
           (status && status !== 'all') || 
           (bundleSize && bundleSize !== 'all') || 
           (design && design !== 'all') ? (
            <Button onClick={handleResetFilters} variant="outline">
              Clear filters
            </Button>
          ) : (
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">Create your first mystery box order</Button>
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
                  <TableHead>Username</TableHead>
                  <TableHead>Bundle Size</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Style Preference</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      Price
                      <span className="text-xs text-muted-foreground">
                        {sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
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
                {mysteryBoxes?.map((mysteryBox) => (
                  <TableRow key={mysteryBox.id}>
                    <TableCell className="font-medium">{mysteryBox.title}</TableCell>
                    <TableCell>
                      {mysteryBox.username ? (
                        <Badge variant="outline" className="text-purple-600">
                          {mysteryBox.username}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {mysteryBox.bundleSize}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {mysteryBox.design === 'IDontCare' ? "I don't care" : mysteryBox.design}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {mysteryBox.stylePreference === 'IDontCare' ? "I don't care" : mysteryBox.stylePreference}
                      </Badge>
                    </TableCell>
                    <TableCell>${Number(mysteryBox.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={mysteryBox.status === 'Pending' ? 'outline' : 
                                mysteryBox.status === 'Delivered' ? 'default' : 'secondary'}
                        className={mysteryBox.status === 'Pending' ? 'text-yellow-600' : 
                                  mysteryBox.status === 'Delivered' ? 'text-green-600' : ''}
                      >
                        {mysteryBox.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(mysteryBox.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(mysteryBox)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mysteryBox.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Mystery Box</DialogTitle>
            <DialogDescription>
              Update the mystery box details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bundle Size</Label>
                  <Select value={formData.bundleSize} onValueChange={(value: "Small" | "Medium" | "Large") => setFormData(prev => ({ ...prev, bundleSize: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Design</Label>
                  <Select value={formData.design} onValueChange={(value: "Simple" | "Extra" | "IDontCare") => setFormData(prev => ({ ...prev, design: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simple">Simple</SelectItem>
                      <SelectItem value="Extra">Extra</SelectItem>
                      <SelectItem value="IDontCare">I don't care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Style Preference</Label>
                  <Select value={formData.stylePreference} onValueChange={(value: "Masculine" | "Feminine" | "IDontCare") => setFormData(prev => ({ ...prev, stylePreference: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculine">Masculine</SelectItem>
                      <SelectItem value="Feminine">Feminine</SelectItem>
                      <SelectItem value="IDontCare">I don't care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-neckMeasurements">Neck Measurements</Label>
                  <Input
                    id="edit-neckMeasurements"
                    value={formData.neckMeasurements}
                    onChange={(e) => setFormData(prev => ({ ...prev, neckMeasurements: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-wristMeasurements">Wrist Measurements</Label>
                  <Input
                    id="edit-wristMeasurements"
                    value={formData.wristMeasurements}
                    onChange={(e) => setFormData(prev => ({ ...prev, wristMeasurements: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (Auto-calculated)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    ${bundleSizePrices[formData.bundleSize]} (Bundle) + ${designPrices[formData.design]} (Design) = ${calculatedPrice}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-colorPreference">Color Preference</Label>
                <Input
                  id="edit-colorPreference"
                  value={formData.colorPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorPreference: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Mystery Box</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
