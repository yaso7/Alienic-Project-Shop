"use client"

import { useState, useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  material?: string
  status?: string
  price?: string
}

interface ProductSelectProps {
  name: string
  label?: string
  placeholder?: string
  className?: string
}

export function ProductSelect({ 
  name, 
  label = "Select Products", 
  placeholder = "Search products...",
  className = ""
}: ProductSelectProps) {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const selectedProductIds = watch(name) || []
  const fieldError = errors[name]
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen, searchQuery])

  const selectedProducts = useMemo(() => {
    if (selectedProductIds.length > 0 && products.length > 0) {
      return products.filter(product => 
        selectedProductIds.includes(product.id)
      )
    }
    return []
  }, [selectedProductIds, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        search: searchQuery,
        status: 'available'
      })
      
      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductToggle = (product: Product, checked: boolean) => {
    let newSelectedIds: string[]
    
    if (checked) {
      newSelectedIds = [...selectedProductIds, product.id]
    } else {
      newSelectedIds = selectedProductIds.filter((id: string) => id !== product.id)
    }
    
    setValue(name, newSelectedIds)
  }

  const removeProduct = (productId: string) => {
    const newSelectedIds = selectedProductIds.filter((id: string) => id !== productId)
    setValue(name, newSelectedIds)
  }

  const isProductSelected = (productId: string) => {
    return selectedProductIds.includes(productId)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* Selected Products Display */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <Badge
              key={product.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {product.name}
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Product Selector */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-start text-left font-normal"
        >
          <Search className="mr-2 h-4 w-4" />
          {selectedProducts.length > 0 
            ? `${selectedProducts.length} product(s) selected`
            : placeholder
          }
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="h-64 overflow-y-auto border rounded-md">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No products found
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleProductToggle(product, !isProductSelected(product.id))}
                    >
                      <input
                        type="checkbox"
                        checked={isProductSelected(product.id)}
                        onChange={() => {}}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.material && `${product.material} • `}
                          {product.price && `${product.price}`}
                          {product.status && ` • ${product.status}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <div className="text-sm text-muted-foreground self-center">
                {selectedProducts.length} selected
              </div>
            </div>
          </div>
        )}
      </div>

      {fieldError?.message && (
        <p className="text-sm text-destructive">{String(fieldError.message)}</p>
      )}
    </div>
  )
}
