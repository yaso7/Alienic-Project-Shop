'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface TableFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onReset: () => void
  placeholder?: string
  additionalFilters?: React.ReactNode
}

export function TableFilters({
  searchValue,
  onSearchChange,
  onReset,
  placeholder = 'Search...',
  additionalFilters,
}: TableFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchValue && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>
      {additionalFilters && <div className="flex gap-2">{additionalFilters}</div>}
    </div>
  )
}
