import type { Metadata } from "next"
import Link from "next/link"
import { ShopGrid } from "@/components/shop/shop-grid"
import { ParticlesBackground } from "@/components/particles/particles-background"
import { prisma } from "@/lib/prisma"

export const revalidate = 60 // Revalidate every 60 seconds

interface ShopPageProps {
  searchParams: Promise<{
    mood?: string
  }>
}

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Acquire handcrafted gothic and metallic artisan pieces from The Alienic Project.",
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { mood } = await searchParams
  
  try {
    // First, fetch all available products
    const products = await prisma.product.findMany({
      where: { 
        status: "Available",
        isCustom: false // Only show brand products in shop
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

    // Filter by mood in memory if mood is provided
    const filteredProducts = mood 
      ? products.filter(product => 
          product.collection?.mood?.includes(mood)
        )
      : products

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
              The Offering
            </h2>
            <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
              {mood ? `Mood: ${mood}` : 'Sacred Acquisitions'}
            </h1>
            <div className="gothic-divider w-48 mx-auto mb-6" />
            <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed mb-8">
              {mood 
                ? `Pieces that embody the ${mood} aesthetic. Each piece is a one-of-a-kind artifact, handcrafted with intention.`
                : "Each piece is a one-of-a-kind artifact, handcrafted with intention. To acquire, reach out via Instagram or Telegram."
              }
            </p>
            {mood && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
              >
                ← View All Products
              </Link>
            )}
            {!mood && (
              <Link
                href="/mystery-box"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
              >
                Mystery Box
              </Link>
            )}
          </div>
        </section>

        <ShopGrid products={filteredProducts} categories={categories} />
      </div>
    )
  } catch (error) {
    console.error('Error in ShopPage:', error)
    return (
      <div className="min-h-screen pt-24">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unable to load products. Please try again later.</p>
        </div>
      </div>
    )
  }
}
