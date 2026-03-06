import type { Metadata } from "next"
import { ShopGrid } from "@/components/shop/shop-grid"
import { ParticlesBackground } from "@/components/particles/particles-background"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export const revalidate = 60 // Revalidate every 60 seconds

interface CollectionPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = await prisma.collection.findUnique({
    where: { slug }
  })

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  return {
    title: `${collection.title} - Collection`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        where: { 
          status: "Available",
          isCustom: false
        },
        include: { 
          collection: true,
          dbCategory: true,
          images: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: "desc" },
      }
    }
  })

  if (!collection) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="relative py-24 md:py-32 px-6 noise-bg text-center overflow-hidden">
        <ParticlesBackground className="opacity-50" />
        <div className="relative z-10">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Collection
          </h2>
          <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
            {collection.title}
          </h1>
          <div className="gothic-divider w-48 mx-auto mb-6" />
          <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed mb-8">
            {collection.description}
          </p>
          {collection.mood.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {collection.mood.map((keyword, i) => (
                <span
                  key={i}
                  className="text-xs uppercase tracking-[0.2em] text-primary border border-border px-3 py-1"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <ShopGrid products={collection.products} categories={categories} />
    </div>
  )
}
