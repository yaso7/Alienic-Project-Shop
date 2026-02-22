'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoryForm } from './category-form'

interface CategoryDialogProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function CategoryDialog({ category, trigger, onSuccess }: CategoryDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          onSuccess={() => {
            setOpen(false)
            if (onSuccess) onSuccess()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
