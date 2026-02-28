"use client"

import Link from "next/link"
import { Edit, Store, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "./delete-dialog"
import { useState } from "react"

export function ProductActions({ 
  productId, 
  productName, 
  isCustom = false, 
  orderStatus,
  onSuccess 
}: { 
  productId: string
  productName: string
  isCustom?: boolean
  orderStatus?: string
  onSuccess?: () => void 
}) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleMoveToShop = async () => {
    if (!productId) {
      alert('Product ID is required')
      return
    }
    
    setLoading('move-to-shop')
    try {
      const response = await fetch(`/api/admin/products/${productId}/move-to-shop`, {
        method: 'POST'
      })
      
      if (response.ok) {
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to move product to shop')
      }
    } catch (error) {
      console.error('Error moving product to shop:', error)
      alert('Failed to move product to shop')
    } finally {
      setLoading(null)
    }
  }

  const handleMoveToGallery = async () => {
    if (!productId) {
      alert('Product ID is required')
      return
    }
    
    setLoading('move-to-gallery')
    try {
      const response = await fetch(`/api/admin/products/${productId}/move-to-gallery`, {
        method: 'POST'
      })
      
      if (response.ok) {
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to move product to gallery')
      }
    } catch (error) {
      console.error('Error moving product to gallery:', error)
      alert('Failed to move product to gallery')
    } finally {
      setLoading(null)
    }
  }

  // Always show move buttons for all products
  const showMoveToShop = true
  const showMoveToGallery = true

  return (
    <div className="flex justify-end gap-2">
      {showMoveToShop && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleMoveToShop}
          disabled={loading === 'move-to-shop'}
          title="Move to Shop"
        >
          <Store className="size-4" />
        </Button>
      )}
      
      {showMoveToGallery && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleMoveToGallery}
          disabled={loading === 'move-to-gallery'}
          title="Move to Gallery"
        >
          <Image className="size-4" />
        </Button>
      )}
      
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="size-4" />
        </Button>
      </Link>
      
      <DeleteDialog
        id={productId}
        name={productName}
        type="product"
        onSuccess={onSuccess}
      />
    </div>
  )
}
