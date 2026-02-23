import type { Metadata } from "next"
import { ShopGrid } from "@/components/shop/shop-grid"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Acquire handcrafted gothic and metallic artisan pieces from The Alienic Project.",
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: { 
      collection: true,
      dbCategory: true, // Include the related category
      images: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: "desc" },
  })

  console.log('ShopPage - Fetched products:', products.map(p => ({ 
    id: p.id, 
    name: p.name, 
    isAvailable: p.isAvailable,
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
          The Offering
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Sacred Acquisitions
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          Each piece is a one-of-a-kind artifact, handcrafted with intention.
          To acquire, reach out via Instagram or Telegram.
        </p>
      </section>

      <ShopGrid products={products} categories={categories} />
    </div>
  )
}
