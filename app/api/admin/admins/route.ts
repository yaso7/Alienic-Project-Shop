import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAuth()
    
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        email: 'asc'
      }
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("Failed to fetch admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}
