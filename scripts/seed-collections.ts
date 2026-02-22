import "dotenv/config"
import { PrismaClient } from '../lib/generated/prisma/client'
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const collectionsData = [
  {
    title: "Oxidized Relics",
    slug: "oxidized-relics",
    subtitle: "Collection I — 2024",
    description: "A collection of silver pieces aged by time and intention, each piece telling a story of transformation and decay.",
    shortDescription: "Silver pieces aged by time and intention",
    mood: ["Ancient", "Weathered", "Sacred"],
    heroImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-Black-PrwFTaDbWXZr9S6Y5KiouNx5x0YhKZ.png",
    order: 1,
  },
  {
    title: "Void Geometry",
    slug: "void-geometry",
    subtitle: "Collection II — 2024",
    description: "Sharp angles meeting organic forms in this exploration of futuristic minimalism and dark aesthetics.",
    shortDescription: "Sharp angles meeting organic forms",
    mood: ["Futuristic", "Minimal", "Dark"],
    heroImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SC-%20Concept.1-Ee32igpxofdLPJjer1kWRmZ1zKmkV3.png",
    order: 2,
  },
  {
    title: "Matte Shadows",
    slug: "matte-shadows",
    subtitle: "Collection III — 2024",
    description: "Black-on-black textured metalwork that plays with light and shadow, creating mysterious and tactile pieces.",
    shortDescription: "Black-on-black textured metalwork",
    mood: ["Mysterious", "Tactile", "Heavy"],
    heroImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png",
    order: 3,
  },
]

async function seedCollections() {
  console.log('🌱 Seeding collections with short descriptions...')

  for (const collectionData of collectionsData) {
    try {
      // Check if collection already exists
      const existingCollection = await prisma.collection.findUnique({
        where: { slug: collectionData.slug }
      })

      if (existingCollection) {
        // Update existing collection with shortDescription
        await prisma.collection.update({
          where: { slug: collectionData.slug },
          data: { shortDescription: collectionData.shortDescription }
        })
        console.log(`✅ Updated collection: ${collectionData.title}`)
      } else {
        // Create new collection
        await prisma.collection.create({
          data: collectionData
        })
        console.log(`✅ Created collection: ${collectionData.title}`)
      }
    } catch (error) {
      console.error(`❌ Error processing collection ${collectionData.title}:`, error)
    }
  }

  console.log('🎉 Collections seeding completed!')
}

async function main() {
  await seedCollections()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
