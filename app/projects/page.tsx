import type { Metadata } from "next"
import Image from "next/image"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the sacred collections of The Alienic Project — each altar a testament to dark artistry.",
}

export default async function ProjectsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { order: "asc" },
  })
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 noise-bg text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          The Archive
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Sacred Collections
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          Each collection is an altar — a curated body of work unified by
          mood, material, and meaning. Enter and bear witness.
        </p>
      </section>

      {/* Collections */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col gap-24">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No collections available yet.</p>
            </div>
          ) : (
            collections.map((collection, index) => (
              <div
                key={collection.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "md:direction-rtl" : ""
                }`}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden group ${
                    index % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={collection.heroImage}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>

                <div
                  className={`flex flex-col gap-4 ${
                    index % 2 === 1 ? "md:order-1 md:text-right md:items-end" : ""
                  }`}
                >
                  {collection.subtitle && (
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {collection.subtitle}
                    </p>
                  )}
                  <h3 className="hero-title text-3xl md:text-4xl text-foreground">
                    {collection.title}
                  </h3>
                  {collection.mood.length > 0 && (
                    <div className="flex flex-wrap gap-2">
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
                  <div className={`gothic-divider w-24 ${index % 2 === 1 ? "md:self-end" : ""}`} />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 bg-secondary text-center">
        <p className="font-[var(--font-fraktur)] text-2xl md:text-3xl text-foreground mb-4">
          Ready to claim your piece?
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Visit the shop or reach out for custom commissions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/shop"
            className="px-8 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
          >
            Enter the Shop
          </a>
          <a
            href="/contact"
            className="px-8 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
          >
            Commission a Piece
          </a>
        </div>
      </section>
    </div>
  )
}
