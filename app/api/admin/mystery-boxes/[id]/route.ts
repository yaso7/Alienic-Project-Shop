import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { mysteryBoxUpdateSchema } from "@/lib/validations/mystery-box"
import { createMysteryBoxNotification, createMysteryBoxStatusChangeNotification } from "@/lib/notifications/mystery-box"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()

  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mystery box ID'
      }, { status: 400 })
    }

    const body = await request.json()
    
    // Validate input data
    const validatedData = mysteryBoxUpdateSchema.parse(body)
    
    // Check if mystery box exists
    const existingBox = await prisma.mysteryBox.findUnique({
      where: { id }
    })
    
    if (!existingBox) {
      return NextResponse.json({
        success: false,
        error: 'Mystery box not found'
      }, { status: 404 })
    }
    
    // Update mystery box
    const mysteryBox = await prisma.mysteryBox.update({
      where: { id },
      data: validatedData,
    })

    // Log successful update
    console.log(`Admin updated mystery box: ID ${mysteryBox.id}, Status: ${mysteryBox.status}`)

    // Create notifications
    await createMysteryBoxNotification(
      mysteryBox.id,
      'updated',
      'Mystery Box Updated',
      `Order for ${mysteryBox.username || 'Customer'} was updated`
    )

    // Create status change notification if status changed
    if (validatedData.status && validatedData.status !== existingBox.status) {
      await createMysteryBoxStatusChangeNotification(
        mysteryBox.id,
        existingBox.status,
        validatedData.status,
        mysteryBox.username || undefined
      )
    }

    return NextResponse.json({
      success: true,
      data: mysteryBox,
      message: "Mystery box updated successfully"
    })

  } catch (error) {
    console.error('Mystery box update error:', error)

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

    // Handle not found errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({
        success: false,
        error: 'Mystery box not found'
      }, { status: 404 })
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
      error: 'Failed to update mystery box. Please try again.'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()

  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mystery box ID'
      }, { status: 400 })
    }
    
    // Check if mystery box exists
    const existingBox = await prisma.mysteryBox.findUnique({
      where: { id }
    })
    
    if (!existingBox) {
      return NextResponse.json({
        success: false,
        error: 'Mystery box not found'
      }, { status: 404 })
    }
    
    // Delete mystery box
    await prisma.mysteryBox.delete({
      where: { id },
    })

    // Log successful deletion
    console.log(`Admin deleted mystery box: ID ${id}, Title: ${existingBox.title}`)

    // Create notification
    await createMysteryBoxNotification(
      id,
      'deleted',
      'Mystery Box Deleted',
      `Order for ${existingBox.username || 'Customer'} was deleted`
    )

    return NextResponse.json({
      success: true,
      message: "Mystery box deleted successfully"
    })

  } catch (error) {
    console.error('Mystery box deletion error:', error)

    // Handle not found errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({
        success: false,
        error: 'Mystery box not found'
      }, { status: 404 })
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
      error: 'Failed to delete mystery box. Please try again.'
    }, { status: 500 })
  }
}
