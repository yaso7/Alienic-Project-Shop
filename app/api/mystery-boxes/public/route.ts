import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { 
  publicMysteryBoxCreationSchema, 
  calculateMysteryBoxPrice, 
  generateMysteryBoxTitle 
} from "@/lib/validations/mystery-box"
import { createMysteryBoxNotification } from "@/lib/notifications/mystery-box"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = publicMysteryBoxCreationSchema.parse(body)
    
    // Calculate price based on bundle size and design
    const calculatedPrice = calculateMysteryBoxPrice(validatedData.bundleSize, validatedData.design)
    
    // Generate title if not provided
    const title = validatedData.title || generateMysteryBoxTitle(validatedData.bundleSize)
    
    // Create mystery box order
    const mysteryBox = await prisma.mysteryBox.create({
      data: {
        title,
        bundleSize: validatedData.bundleSize,
        design: validatedData.design,
        stylePreference: validatedData.stylePreference || 'IDontCare',
        neckMeasurements: validatedData.neckMeasurements,
        wristMeasurements: validatedData.wristMeasurements,
        colorPreference: validatedData.colorPreference,
        notes: validatedData.notes,
        username: validatedData.username,
        price: calculatedPrice,
        status: 'Pending',
      },
    })

    // Log successful creation
    console.log(`Mystery box order created successfully: ID ${mysteryBox.id}, Username: ${mysteryBox.username}, Price: $${calculatedPrice}`)

    // Create notification
    await createMysteryBoxNotification(
      mysteryBox.id,
      'created',
      'New Mystery Box Order',
      `Order from ${mysteryBox.username || 'Anonymous'} - ${mysteryBox.bundleSize} bundle`
    )

    return NextResponse.json({
      success: true,
      data: mysteryBox,
      message: "Mystery box order created successfully"
    })

  } catch (error) {
    console.error('Public mystery box creation error:', error)

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
      error: 'Failed to create mystery box order. Please try again.'
    }, { status: 500 })
  }
}
