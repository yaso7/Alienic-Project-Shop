/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "../lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || "admin@example.com"
  const password = process.argv[3] || "admin123"

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>")
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const admin = await prisma.adminUser.upsert({
      where: { email },
      update: {
        hashedPassword,
      },
      create: {
        email,
        hashedPassword,
      },
    })

    console.log(`✅ Admin user created/updated: ${admin.email}`)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
