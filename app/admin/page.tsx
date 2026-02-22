import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Package, MessageSquare, Mail, AlertCircle } from "lucide-react"

export default async function AdminDashboardPage() {
  const [collectionsCount, productsCount, pendingTestimonialsCount, newMessagesCount] =
    await Promise.all([
      prisma.collection.count(),
      prisma.product.count(),
      prisma.testimonial.count({ where: { status: "Pending" } }),
      prisma.contactMessage.count({ where: { status: "New" } }),
    ])

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
    </div>
  )
}
