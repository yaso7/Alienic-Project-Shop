import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  await requireAuth()

  try {
    const adminUsers = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        email: 'asc'
      }
    })

    return NextResponse.json({ adminUsers })
  } catch (error) {
    console.error('Failed to fetch admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    )
  }
}
