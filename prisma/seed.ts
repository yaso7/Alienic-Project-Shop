import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting seed...")

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...")
  await prisma.testimonial.deleteMany()
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.category.deleteMany()
  await prisma.adminUser.deleteMany()

  // Create Admin User
  console.log("👤 Creating admin user...")
  const hashedPassword = await bcrypt.hash("admin", 10)
  const admin = await prisma.adminUser.create({
    data: {
      email: "satanson78@gmail.com",
      hashedPassword,
    },
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // Create Collections
  console.log("📦 Creating collections...")
  const oxidizedRelics = await prisma.collection.create({
    data: {
      slug: "oxidized-relics",
      title: "Oxidized Relics",
      subtitle: "Collection I — 2024",
      description:
        "The first collection drew from the beauty of decay — silver pieces intentionally aged to carry the weight of time. Each relic bears the marks of a deliberate transformation, as if unearthed from a forgotten shrine.",
      mood: ["Ancient", "Weathered", "Sacred"],
      heroImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-Black-PrwFTaDbWXZr9S6Y5KiouNx5x0YhKZ.png",
      order: 1,
    },
  })

  const voidGeometry = await prisma.collection.create({
    data: {
      slug: "void-geometry",
      title: "Void Geometry",
      subtitle: "Collection II — 2024",
      description:
        "Where sharp angles meet organic curves. This collection explores the tension between precision and chaos — geometric forms that seem to fold in on themselves, creating portals to the void.",
      mood: ["Futuristic", "Minimal", "Dark"],
      heroImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SC-%20Concept.1-Ee32igpxofdLPJjer1kWRmZ1zKmkV3.png",
      order: 2,
    },
  })

  const matteShadows = await prisma.collection.create({
    data: {
      slug: "matte-shadows",
      title: "Matte Shadows",
      subtitle: "Collection III — 2025",
      description:
        "An exploration of darkness itself. Black-on-black textured metalwork that absorbs light and demands touch. These pieces exist in the space between visibility and void — shadow made solid.",
      mood: ["Mysterious", "Tactile", "Heavy"],
      heroImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png",
      order: 3,
    },
  })

  const stellarFragments = await prisma.collection.create({
    data: {
      slug: "stellar-fragments",
      title: "Stellar Fragments",
      subtitle: "Collection IV — 2025",
      description:
        "Inspired by the remnants of collapsed stars. Each piece in this collection captures the paradox of cosmic violence and beauty — raw metal surfaces that catch light like distant nebulae.",
      mood: ["Cosmic", "Raw", "Luminous"],
      heroImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Card-Front-m3BoQOivskc8izgiDAkRwaU9IqcqJB.png",
      order: 4,
    },
  })

  console.log("✅ Collections created")

  // Create Categories
  console.log("🏷️  Creating categories...")
  const categories = {
    pendant: await prisma.category.create({
      data: {
        name: "Pendants",
        slug: "pendants",
        description: "Hanging jewelry pieces worn on chains or cords",
      },
    }),
    ring: await prisma.category.create({
      data: {
        name: "Rings",
        slug: "rings",
        description: "Statement rings and everyday pieces crafted with precision",
      },
    }),
    chain: await prisma.category.create({
      data: {
        name: "Chains",
        slug: "chains",
        description: "Metal chains and leather strands",
      },
    }),
    oneOfOne: await prisma.category.create({
      data: {
        name: "One of One",
        slug: "one-of-one",
        description: "Unique, limited edition pieces",
      },
    }),
    other: await prisma.category.create({
      data: {
        name: "Other",
        slug: "other",
        description: "Miscellaneous jewelry items",
      },
    }),
  }
  console.log("✅ Categories created")

  // Create Products
  console.log("🛍️ Creating products...")

  const voidPendant = await prisma.product.create({
    data: {
      slug: "the-void-pendant",
      name: "The Void Pendant",
      categoryId: categories.pendant.id,
      price: "$85",
      priceNumeric: 85,
      material: "Oxidized Sterling Silver",
      collectionId: oxidizedRelics.id,
      story:
        "Born from the silence between stars. This pendant captures the gravitational pull of absence — a void that draws the eye and holds the spirit. Handforged and darkened through controlled oxidation.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-Black-PrwFTaDbWXZr9S6Y5KiouNx5x0YhKZ.png",
      isFeatured: true,
      isAvailable: true,
    },
  })

  const stellarRing = await prisma.product.create({
    data: {
      slug: "stellar-fragment-ring",
      name: "Stellar Fragment Ring",
      categoryId: categories.ring.id,
      price: "$120",
      priceNumeric: 120,
      material: "Matte Black Steel",
      collectionId: voidGeometry.id,
      story:
        "A fractured piece of cosmic geometry, wrapped around your finger like a promise from another dimension. The angular surfaces catch light in unexpected ways, shifting between shadow and shine.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SC-%20Concept.1-Ee32igpxofdLPJjer1kWRmZ1zKmkV3.png",
      isFeatured: true,
      isAvailable: true,
    },
  })

  const beacon = await prisma.product.create({
    data: {
      slug: "the-beacon",
      name: "The Beacon",
      categoryId: categories.pendant.id,
      price: "$95",
      priceNumeric: 95,
      material: "Brushed Silver, Black Cord",
      collectionId: matteShadows.id,
      story:
        "A four-pointed star that serves as a guide through the darkness. The beacon pendant is both compass and talisman — a reminder that light persists even in the deepest void.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png",
      isFeatured: false,
      isAvailable: true,
    },
  })

  const chainOfWhispers = await prisma.product.create({
    data: {
      slug: "chain-of-whispers",
      name: "Chain of Whispers",
      categoryId: categories.chain.id,
      price: "$65",
      priceNumeric: 65,
      material: "Oxidized Silver Links",
      collectionId: oxidizedRelics.id,
      story:
        "Each link forged separately, carrying its own imperfections like whispered secrets. This chain is designed to age with you, growing darker and more characterful with wear.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Card-Front-m3BoQOivskc8izgiDAkRwaU9IqcqJB.png",
      isFeatured: false,
      isAvailable: true,
    },
  })

  const relicOfFallenStar = await prisma.product.create({
    data: {
      slug: "relic-of-the-fallen-star",
      name: "Relic of the Fallen Star",
      categoryId: categories.oneOfOne.id,
      price: "$250",
      priceNumeric: 250,
      material: "Mixed Metals, Meteorite Fragment",
      collectionId: stellarFragments.id,
      story:
        "The crown jewel of the collection. A mixed-metal sculpture pendant incorporating a genuine meteorite fragment — a piece of the cosmos you can carry. Utterly unique, never to be replicated.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.Sticker-%20Logo-zkFcGsmctG92tbpbE9EKeUL5Jrkz5d.png",
      isFeatured: true,
      isAvailable: true,
    },
  })

  const obsidianBand = await prisma.product.create({
    data: {
      slug: "obsidian-band",
      name: "Obsidian Band",
      categoryId: categories.ring.id,
      price: "$90",
      priceNumeric: 90,
      material: "Matte Black Titanium",
      collectionId: matteShadows.id,
      story:
        "A ring that absorbs light. The matte black titanium surface is treated to resist fingerprints and shine, creating a permanent shadow that wraps your finger in darkness.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-Black-PrwFTaDbWXZr9S6Y5KiouNx5x0YhKZ.png",
      isFeatured: false,
      isAvailable: true,
    },
  })

  // Additional products for variety
  const eclipsePendant = await prisma.product.create({
    data: {
      slug: "eclipse-pendant",
      name: "Eclipse Pendant",
      categoryId: categories.pendant.id,
      price: "$110",
      priceNumeric: 110,
      material: "Oxidized Silver with Moonstone",
      collectionId: stellarFragments.id,
      story:
        "A celestial alignment captured in metal. The eclipse pendant features a moonstone centerpiece that shifts between light and shadow, mirroring the cosmic dance of celestial bodies.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png",
      isFeatured: false,
      isAvailable: true,
    },
  })

  const voidChain = await prisma.product.create({
    data: {
      slug: "void-chain",
      name: "Void Chain",
      categoryId: categories.chain.id,
      price: "$75",
      priceNumeric: 75,
      material: "Matte Black Steel Links",
      collectionId: voidGeometry.id,
      story:
        "Geometric links that form a chain of negative space. Each link is precisely cut to create voids within the structure, making the absence as important as the presence.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Card-Front-m3BoQOivskc8izgiDAkRwaU9IqcqJB.png",
      isFeatured: false,
      isAvailable: true,
    },
  })

  console.log("✅ Products created")

  // Create Testimonials
  console.log("💬 Creating testimonials...")

  await prisma.testimonial.create({
    data: {
      name: "Mara V.",
      location: "Berlin, Germany",
      rating: 5,
      text: "The piece arrived wrapped in black tissue like a relic from another world. It carries a weight that goes beyond the physical — you can feel the intention in every curve and edge.",
      source: "Manual",
      status: "Approved",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Kai S.",
      location: "Portland, USA",
      rating: 5,
      text: "I've never owned anything that felt so deliberately crafted. The oxidation gives it this living quality, like it's still transforming. Absolutely transcendent work.",
      source: "Manual",
      status: "Approved",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Lena R.",
      location: "Stockholm, Sweden",
      rating: 5,
      text: "More than jewelry — it's a conversation piece that speaks without words. Strangers stop me to ask about it. It feels like wearing a secret.",
      source: "Manual",
      status: "Approved",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Dmitri K.",
      location: "Moscow, Russia",
      rating: 4,
      text: "The craftsmanship is undeniable. Each surface tells a story of the hands that shaped it. This is what happens when art refuses to be mass-produced.",
      source: "Manual",
      status: "Approved",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Anya T.",
      location: "Tokyo, Japan",
      rating: 5,
      text: "I commissioned a custom piece and the entire process felt sacred — from the initial conversation to the moment I unwrapped it. It's become my most treasured possession.",
      source: "Manual",
      status: "Approved",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Sol M.",
      location: "Buenos Aires, Argentina",
      rating: 5,
      text: "The Relic of the Fallen Star is extraordinary. Knowing there's actual meteorite in the piece makes it feel like I'm carrying a fragment of the universe. Incomparable artistry.",
      source: "Manual",
      status: "Approved",
    },
  })

  // Add a few pending testimonials for moderation demo
  await prisma.testimonial.create({
    data: {
      name: "Alex K.",
      location: "London, UK",
      rating: 5,
      text: "Absolutely stunning piece. The attention to detail is remarkable. Can't wait to add more to my collection.",
      source: "Form",
      status: "Pending",
    },
  })

  await prisma.testimonial.create({
    data: {
      name: "Sofia M.",
      location: "Barcelona, Spain",
      rating: 5,
      text: "The Void Chain is everything I hoped for and more. It's become a daily essential — I feel incomplete without it.",
      source: "Form",
      status: "Pending",
    },
  })

  console.log("✅ Testimonials created")

  // Create Sample Contact Messages
  console.log("📧 Creating sample contact messages...")

  await prisma.contactMessage.create({
    data: {
      name: "Jordan P.",
      email: "jordan@example.com",
      subject: "Custom Commission",
      message:
        "I'm interested in commissioning a custom piece inspired by the Stellar Fragments collection. I have a specific design in mind involving a combination of oxidized silver and a small meteorite fragment. Could we discuss timelines and pricing?",
      status: "New",
    },
  })

  await prisma.contactMessage.create({
    data: {
      name: "Raven L.",
      email: "raven@example.com",
      subject: "Place an Order",
      message:
        "I'd like to order The Void Pendant. I saw it featured on your Instagram and it's exactly what I've been searching for. Please let me know about availability and shipping options to Canada.",
      status: "Read",
    },
  })

  await prisma.contactMessage.create({
    data: {
      name: "Nyx A.",
      email: "nyx@example.com",
      subject: "General Inquiry",
      message:
        "Your work is absolutely breathtaking. I'm curious about your process — how do you achieve that specific oxidation effect? Also, do you offer workshops or apprenticeships?",
      status: "New",
    },
  })

  console.log("✅ Contact messages created")

  // Create dummy notifications
  console.log("🔔 Creating notification history...")
  await prisma.notification.deleteMany() // Clear existing notifications

  // Get some contact messages and testimonials to link to
  const contactMessages = await prisma.contactMessage.findMany({ take: 3 })
  const testimonials = await prisma.testimonial.findMany({ where: { status: 'Pending' }, take: 2 })

  if (contactMessages.length > 0) {
    await prisma.notification.create({
      data: {
        type: 'contact',
        referenceId: contactMessages[0].id,
        title: `New message from ${contactMessages[0].name}`,
        body: contactMessages[0].subject,
        isRead: false,
      },
    })
  }

  if (contactMessages.length > 1) {
    await prisma.notification.create({
      data: {
        type: 'contact',
        referenceId: contactMessages[1].id,
        title: `New message from ${contactMessages[1].name}`,
        body: contactMessages[1].subject,
        isRead: false,
      },
    })
  }

  if (testimonials.length > 0) {
    await prisma.notification.create({
      data: {
        type: 'testimonial',
        referenceId: testimonials[0].id,
        title: `New testimonial from ${testimonials[0].name}`,
        body: `${testimonials[0].rating}★ review`,
        isRead: false,
      },
    })
  }

  if (contactMessages.length > 2) {
    await prisma.notification.create({
      data: {
        type: 'contact',
        referenceId: contactMessages[2].id,
        title: `New message from ${contactMessages[2].name}`,
        body: contactMessages[2].subject,
        isRead: true,
      },
    })
  }

  if (testimonials.length > 1) {
    await prisma.notification.create({
      data: {
        type: 'testimonial',
        referenceId: testimonials[1].id,
        title: `New testimonial from ${testimonials[1].name}`,
        body: `${testimonials[1].rating}★ review`,
        isRead: true,
      },
    })
  }

  await prisma.notification.create({
    data: {
      type: 'system',
      title: 'Testimonial Approved',
      body: 'A testimonial was approved by admin.',
      isRead: true,
    },
  })

  console.log("✅ Notifications created")

  console.log("\n✨ Seed completed successfully!")
  console.log("\n📊 Summary:")
  console.log(`   - Admin user: ${admin.email}`)
  console.log(`   - Categories: 5`)
  console.log(`   - Collections: 4`)
  console.log(`   - Products: 8`)
  console.log(`   - Testimonials: 8 (6 approved, 2 pending)`)
  console.log(`   - Contact messages: 3`)
  console.log(`   - Notifications: 6 (3 unread, 3 read)`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
