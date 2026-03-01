import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    
    const resolvedParams = await params
    const productId = resolvedParams.id
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Move to gallery - change status to archived
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "Archived"
      }
    })

    // Revalidate cache for shop and gallery pages
    revalidatePath('/shop')
    revalidatePath('/gallery')
    revalidatePath('/')

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: "Product moved to gallery successfully" 
    })
  } catch (error) {
    console.error("Failed to move product to gallery:", error)
    return NextResponse.json(
      { error: "Failed to move product to gallery", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
