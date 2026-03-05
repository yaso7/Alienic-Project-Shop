import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { 
  mysteryBoxCreationSchema, 
  calculateMysteryBoxPrice, 
  generateMysteryBoxTitle 
} from "@/lib/validations/mystery-box"
import { createMysteryBoxNotification } from "@/lib/notifications/mystery-box"

export async function GET(request: Request) {
  await requireAuth()

  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const status = url.searchParams.get('status')
    const bundleSize = url.searchParams.get('bundleSize')
    const design = url.searchParams.get('design')
    const style = url.searchParams.get('style')
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * pageSize

    let where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (bundleSize && bundleSize !== 'all') {
      where.bundleSize = bundleSize
    }

    if (design && design !== 'all') {
      where.design = design
    }

    if (style && style !== 'all') {
      where.stylePreference = style
    }

    // Build orderBy object
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [mysteryBoxes, total] = await Promise.all([
      prisma.mysteryBox.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.mysteryBox.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        mysteryBoxes,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error('Mystery boxes fetch error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch mystery boxes' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await requireAuth()

  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = mysteryBoxCreationSchema.parse(body)
    
    // Calculate price if not provided or use provided price
    let finalPrice = validatedData.price
    if (finalPrice === 0) {
      finalPrice = calculateMysteryBoxPrice(validatedData.bundleSize, validatedData.design)
    }
    
    // Generate title if not provided
    const title = validatedData.title || generateMysteryBoxTitle(validatedData.bundleSize)
    
    // Create mystery box order
    const mysteryBox = await prisma.mysteryBox.create({
      data: {
        title,
        bundleSize: validatedData.bundleSize,
        design: validatedData.design,
        stylePreference: validatedData.stylePreference,
        neckMeasurements: validatedData.neckMeasurements,
        wristMeasurements: validatedData.wristMeasurements,
        colorPreference: validatedData.colorPreference,
        notes: validatedData.notes,
        username: validatedData.username,
        price: finalPrice,
        status: validatedData.status,
      },
    })

    // Log successful creation
    console.log(`Admin created mystery box: ID ${mysteryBox.id}, Status: ${mysteryBox.status}, Price: $${finalPrice}`)

    // Create notification
    await createMysteryBoxNotification(
      mysteryBox.id,
      'created',
      'Admin Created Mystery Box',
      `Admin created order for ${mysteryBox.username || 'Customer'} - ${mysteryBox.bundleSize} bundle`
    )

    return NextResponse.json({
      success: true,
      data: mysteryBox,
      message: "Mystery box created successfully"
    })

  } catch (error) {
    console.error('Admin mystery box creation error:', error)

    // Handle validation errors
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 })
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({
        success: false,
        error: 'A duplicate entry was found'
      }, { status: 409 })
    }

    // Handle database connection errors
    if (error instanceof Error && error.message.includes('connection')) {
      return NextResponse.json({
        success: false,
        error: 'Database connection error. Please try again later.'
      }, { status: 503 })
    }

    // Generic error handling
    return NextResponse.json({
      success: false,
      error: 'Failed to create mystery box. Please try again.'
    }, { status: 500 })
  }
}
