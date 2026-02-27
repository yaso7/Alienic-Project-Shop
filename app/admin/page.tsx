import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Package, MessageSquare, Mail, AlertCircle } from "lucide-react"
import { AdminProductsTable } from "@/components/admin/admin-products-table"

interface ProductData {
  name: string
  value: number
  color: string
}

interface AdminData {
  id: string
  email: string
  madeCount: number
  addedCount: number
}

export default async function AdminDashboardPage() {
  const [collectionsCount, productsCount, pendingTestimonialsCount, newMessagesCount] =
    await Promise.all([
      prisma.collection.count(),
      prisma.product.count(),
      prisma.testimonial.count({ where: { status: "Pending" } }),
      prisma.contactMessage.count({ where: { status: "New" } }),
    ])

  // Fetch admin products data directly from database
  let adminProductsData: AdminData[] = []
  try {
    // Get all admins
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true
      }
    })

    // Get products grouped by madeBy
    const productsByMadeBy = await prisma.product.groupBy({
      by: ['madeBy'],
      where: {
        madeBy: {
          not: null
        }
      },
      _count: {
        id: true
      }
    })

    // Get products grouped by addedBy
    const productsByAddedBy = await prisma.product.groupBy({
      by: ['addedBy'],
      where: {
        addedBy: {
          not: null
        }
      },
      _count: {
        id: true
      }
    })

    // Create maps for quick lookup
    const madeByMap = productsByMadeBy.reduce((map, item) => {
      if (item.madeBy) map[item.madeBy] = item._count.id
      return map
    }, {} as Record<string, number>)

    const addedByMap = productsByAddedBy.reduce((map, item) => {
      if (item.addedBy) map[item.addedBy] = item._count.id
      return map
    }, {} as Record<string, number>)

    // Format data for the table
    adminProductsData = admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      madeCount: madeByMap[admin.id] || 0,
      addedCount: addedByMap[admin.id] || 0
    })).filter(admin => admin.madeCount > 0 || admin.addedCount > 0) // Only show admins with products
  } catch (error) {
    console.error('Failed to fetch admin products data:', error)
  }

  const stats = [
    {
      title: "Collections",
      count: collectionsCount,
      href: "/admin/collections",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Products",
      count: productsCount,
      href: "/admin/products",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Pending Testimonials",
      count: pendingTestimonialsCount,
      href: "/admin/testimonials",
      icon: MessageSquare,
      color: pendingTestimonialsCount > 0 ? "text-yellow-500" : "text-muted-foreground",
    },
    {
      title: "New Messages",
      count: newMessagesCount,
      href: "/admin/messages",
      icon: Mail,
      color: newMessagesCount > 0 ? "text-primary" : "text-muted-foreground",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your content and pending items
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="p-6 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`${stat.color} size-6`} />
                {stat.count > 0 && stat.title.includes("Pending") && (
                  <AlertCircle className="size-4 text-yellow-500" />
                )}
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {stat.count}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Admin Product Activity
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Number of products each admin has made and added to the system
          </p>
          <AdminProductsTable data={adminProductsData} />
        </Card>
      </div>
    </div>
  )
}
