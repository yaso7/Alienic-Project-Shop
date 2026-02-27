import { requireAuth } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Package, MessageSquare, Mail, Home, Tag, ShoppingCart } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAuth()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card z-30 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground mb-1">Admin Portal</h1>
            <p className="text-xs text-muted-foreground break-words">{admin.email}</p>
          </div>

          {/* Navigation */}
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
                <Link
                  href="/admin/products"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                >
                  <Package size={18} />
                  Products
                </Link>
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

          {/* Footer - Link to site */}
          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
            >
              <Home size={18} />
              View Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header */}
        <AdminHeader email={admin.email} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  )
}
