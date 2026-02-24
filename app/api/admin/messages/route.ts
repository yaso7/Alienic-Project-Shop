import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  await requireAuth()

  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const status = url.searchParams.get('status') // New, Read, Archived
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * pageSize

    let where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // Build orderBy object
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.contactMessage.count({ where }),
    ])

    return NextResponse.json({
      messages,
      total,
      page,
      pageSize,
    })
  } catch (e) {
    console.error('Messages fetch error', e)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
