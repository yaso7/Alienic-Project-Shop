import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { status } = body

    console.log("Updating testimonial:", { id, status })

    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      console.log("Invalid status:", status)
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Check if testimonial exists first
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existingTestimonial) {
      console.log("Testimonial not found:", id)
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      )
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { status: status as any },
    })
    
    console.log("Successfully updated testimonial:", updatedTestimonial.id)
    
    // Revalidate cache
    revalidatePath('/admin/testimonials')
    revalidatePath('/')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}
