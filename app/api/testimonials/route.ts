import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const testimonialSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
  product: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = testimonialSchema.parse(body)

    // Try to find product by name if provided
    let productId: string | undefined
    if (data.product) {
      const product = await prisma.product.findFirst({
        where: { name: { contains: data.product, mode: "insensitive" } },
      })
      productId = product?.id
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        location: data.location || null,
        rating: data.rating,
        text: data.text,
        productId: productId || null,
        source: "Form",
        status: "Pending",
      },
    })

    // Create notification for new testimonial
    await prisma.notification.create({
      data: {
        type: "testimonial",
        referenceId: testimonial.id,
        title: `New testimonial from ${data.name}`,
        body: `${data.rating}★ review`,
        isRead: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Testimonial creation error:", error)
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    )
  }
}
