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
    const status = url.searchParams.get('status') // available, unavailable, featured
    const categoryId = url.searchParams.get('categoryId')

    const skip = (page - 1) * pageSize

    let where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status === 'featured') {
      where.isFeatured = true
    } else if (status === 'available') {
      where.isAvailable = true
    } else if (status === 'unavailable') {
      where.isAvailable = false
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { 
          collection: true,
          dbCategory: true, // Include the related category
          images: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      pageSize,
    })
  } catch (e) {
    console.error('Products fetch error', e)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
