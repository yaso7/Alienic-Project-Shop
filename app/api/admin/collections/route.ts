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

    const skip = (page - 1) * pageSize

    let where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.collection.count({ where }),
    ])

    return NextResponse.json({
      collections,
      total,
      page,
      pageSize,
    })
  } catch (e) {
    console.error('Collections fetch error', e)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}
