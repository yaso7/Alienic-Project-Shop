import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET(request: Request) {
  await requireAuth()

  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const sortBy = url.searchParams.get('sortBy') || 'order'
    const sortOrder = url.searchParams.get('sortOrder') || 'asc'

    const skip = (page - 1) * pageSize

    let where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy object
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy,
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

export async function POST(request: Request) {
  await requireAuth()

  try {
    const body = await request.json()
    const { title, slug, subtitle, description, shortDescription, mood, heroImage, order } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        description,
        shortDescription: shortDescription || null,
        mood: mood || [],
        heroImage,
        order: order || 0,
      },
    })

    // Revalidate cache for home page (featured collections)
    revalidatePath('/')

    return NextResponse.json(collection)
  } catch (e: any) {
    console.error('Collection creation error', e)
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'Collection with this title or slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}
