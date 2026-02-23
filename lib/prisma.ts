import { PrismaClient } from "./generated/prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL?.includes('sslmode=') 
    ? process.env.DATABASE_URL.replace(/sslmode=[^&]*/, 'sslmode=verify-full')
    : `${process.env.DATABASE_URL}?sslmode=verify-full`
})
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
