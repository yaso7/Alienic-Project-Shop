"use client"

import Link from "next/link"
import { LayoutDashboard, Package, MessageSquare, Mail, Home, Tag, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

export function AdminNavigation() {
  const [productsExpanded, setProductsExpanded] = useState(false)

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/collections"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <Package size={18} />
            Collections
          </Link>
        </li>
        <li>
          <div>
            <button
              onClick={() => setProductsExpanded(!productsExpanded)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md w-full"
            >
              <Package size={18} />
              Products
              {productsExpanded ? <ChevronDown size={16} className="ml-auto" /> : <ChevronRight size={16} className="ml-auto" />}
            </button>
            {productsExpanded && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <Link
                    href="/admin/products"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products/brand"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    Brand Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products/custom"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    Custom Products
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </li>
        <li>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <Tag size={18} />
            Categories
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <ShoppingCart size={18} />
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/admin/testimonials"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <MessageSquare size={18} />
            Testimonials
          </Link>
        </li>
        <li>
          <Link
            href="/admin/messages"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
          >
            <Mail size={18} />
            Messages
          </Link>
        </li>
      </ul>
    </nav>
  )
}
