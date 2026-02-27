"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AdminData {
  id: string
  email: string
  madeCount: number
  addedCount: number
}

interface AdminProductsTableProps {
  data: AdminData[]
}

type SortField = 'email' | 'madeCount' | 'addedCount'
type SortDirection = 'asc' | 'desc'

export function AdminProductsTable({ data }: AdminProductsTableProps) {
  const [sortField, setSortField] = useState<SortField>('madeCount')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc') // Default to descending for new field
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No admin data available
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('email')}
                className="h-auto p-0 font-semibold"
              >
                Admin Email
                {getSortIcon('email')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('madeCount')}
                className="h-auto p-0 font-semibold"
              >
                Products Made
                {getSortIcon('madeCount')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('addedCount')}
                className="h-auto p-0 font-semibold"
              >
                Products Added
                {getSortIcon('addedCount')}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.email}</TableCell>
              <TableCell className="text-lg font-semibold">{admin.madeCount}</TableCell>
              <TableCell className="text-lg font-semibold">{admin.addedCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
