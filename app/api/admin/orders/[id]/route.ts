import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    
    // Extract ID from URL as fallback
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/')
    const orderId = pathSegments[pathSegments.length - 1]
    
    console.log("Request params:", params)
    console.log("Request URL:", request.url)
    console.log("Extracted order ID:", orderId)
    
    const finalOrderId = params?.id || orderId
    
    if (!finalOrderId) {
      console.error("No order ID provided")
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    console.log("Received order update data:", JSON.stringify(body, null, 2))
    
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

    // Update the order
    const order = await prisma.order.update({
      where: { id: finalOrderId },
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

    // Handle product status updates based on order status
    if (status === "Delivered" || status === "Cancelled") {
      try {
        // Get all products in this order with their details
        const orderProducts = await prisma.orderProduct.findMany({
          where: { orderId: finalOrderId },
          include: {
            product: true
          }
        })

        for (const orderProduct of orderProducts) {
          const product = orderProduct.product
          
          if (status === "Delivered") {
            // Rule 1: If order is delivered, brand products status should be changed to archived
            if (!product.isCustom) {
              await prisma.product.update({
                where: { id: product.id },
                data: { status: "Archived" }
              })
            }
            // Custom products keep their status when delivered (Rule 3)
          } else if (status === "Cancelled") {
            // Rule 2: If order is cancelled, custom products keep their status
            // Brand products also keep their status when cancelled
            // No status change needed for cancelled orders
          }
        }
      } catch (productStatusError) {
        console.error("Failed to update product statuses:", productStatusError)
        // Continue with order update even if product status update fails
      }
    }

    // Handle product relations - simpler approach
    try {
      // First, delete all existing products for this order
      await prisma.orderProduct.deleteMany({
        where: { orderId: finalOrderId }
      })

      // Then create new products if any are provided
      if (products && products.length > 0) {
        await prisma.orderProduct.createMany({
          data: products.map((product: any) => ({
            orderId: finalOrderId,
            productId: product.productId,
            quantity: product.quantity
          })),
          skipDuplicates: true
        })
      }
    } catch (productError) {
      console.error("Failed to handle products:", productError)
      // Continue with order update even if product handling fails
    }

    // Fetch the complete order with products
    const completeOrder = await prisma.order.findUnique({
      where: { id: finalOrderId },
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
    console.error("Failed to update order:", error)
    return NextResponse.json(
      { error: "Failed to update order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    
    // Extract ID from URL as fallback
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/')
    const orderId = pathSegments[pathSegments.length - 1]
    
    console.log("DELETE Request params:", params)
    console.log("DELETE Request URL:", request.url)
    console.log("DELETE Extracted order ID:", orderId)
    
    const finalOrderId = params?.id || orderId
    
    if (!finalOrderId) {
      console.error("No order ID provided for DELETE")
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }
    
    // Delete order products first (due to foreign key constraint)
    await prisma.orderProduct.deleteMany({
      where: { orderId: finalOrderId }
    })

    // Then delete the order
    await prisma.order.delete({
      where: { id: finalOrderId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete order:", error)
    return NextResponse.json(
      { error: "Failed to delete order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
