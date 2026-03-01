import type { Metadata } from "next"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { prisma } from "@/lib/prisma"

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore our collection of completed and sold artisan pieces from The Alienic Project archives.",
}

export default async function GalleryPage() {
  const products = await prisma.product.findMany({
    where: { 
      status: "Archived"
    },
    include: { 
      collection: true,
      dbCategory: true, // Include related category
      images: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: "desc" },
  })

  console.log('GalleryPage - Fetched archived products:', products.map(p => ({ 
    id: p.id, 
    name: p.name, 
    status: p.status,
    isCustom: p.isCustom,
    categoryId: p.categoryId,
    categoryName: p.dbCategory?.name 
  })))

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 noise-bg text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          The Archives
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Sacred Legacies
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          A collection of completed works and sold pieces. Each artifact tells a story of creation and transformation,
          now preserved in our eternal gallery.
        </p>
      </section>

      <GalleryGrid products={products} categories={categories} />
    </div>
  )
}
