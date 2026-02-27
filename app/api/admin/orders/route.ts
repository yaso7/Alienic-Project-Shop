import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAuth()
    
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerUsername,
      source,
      totalAmount,
      status,
      notes,
      estimatedDelivery,
      actualDelivery,
      products
    } = body

    // Create the order first
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone: customerPhone || null,
        customerUsername: customerUsername || null,
        source,
        totalAmount: parseFloat(totalAmount),
        status,
        notes: notes || null,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
        actualDelivery: actualDelivery ? new Date(actualDelivery) : null,
      }
    })

    // If there are products, create the order-product relations
    if (products && products.length > 0) {
      await prisma.orderProduct.createMany({
        data: products.map((product: any) => ({
          orderId: order.id,
          productId: product.productId,
          quantity: product.quantity
        }))
      })
    }

    // Fetch the complete order with products
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(completeOrder)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
