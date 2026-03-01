import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params

  try {
    // Get product with order information
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        dbCategory: true,
        collection: true,
        madeByAdmin: {
          select: { id: true, email: true }
        },
        addedByAdmin: {
          select: { id: true, email: true }
        },
        orderProducts: {
          include: {
            order: {
              select: { status: true }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get the latest order status for this product
    const latestOrderStatus = product.orderProducts.length > 0 
      ? product.orderProducts[0].order.status 
      : null

    return NextResponse.json({
      ...product,
      orderStatus: latestOrderStatus
    })
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params

  try {
    await prisma.product.delete({
      where: { id },
    })
    
    // Revalidate cache for shop, gallery and home pages
    revalidatePath('/shop')
    revalidatePath('/gallery')
    revalidatePath('/')
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete error:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params
  const formData = await request.formData()
  const method = formData.get("_method")

  if (method === "DELETE") {
    try {
      await prisma.product.delete({
        where: { id },
      })
      
      // Revalidate cache for shop, gallery and home pages
      revalidatePath('/shop')
      revalidatePath('/gallery')
      revalidatePath('/')
      
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
