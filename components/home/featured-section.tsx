import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getCollections() {
  return await prisma.collection.findMany({
    orderBy: { order: "asc" },
    take: 3 // Limit to 3 featured collections
  })
}

export async function FeaturedSection() {
  const collections = await getCollections()
  return (
    <section className="py-24 md:py-32 px-6 bg-secondary">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Featured Collections
          </h2>
          <p className="main-title text-3xl md:text-5xl text-foreground">
            Sacred Offerings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href="/projects"
              className="group relative overflow-hidden aspect-[3/4] bg-card"
            >
              <Image
                src={collection.heroImage}
                alt={collection.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {collection.mood.join(" / ")}
                </p>
                <h3 className="main-title text-2xl text-foreground">
                  {collection.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {collection.shortDescription || collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block px-8 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
