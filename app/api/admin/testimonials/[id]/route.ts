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
    const { status, showOnHomepage } = body

    console.log("Updating testimonial:", { id, status, showOnHomepage })

    // Validate status if provided
    if (status && !["Approved", "Rejected", "Pending"].includes(status)) {
      console.log("Invalid status:", status)
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Validate showOnHomepage if provided
    if (showOnHomepage !== undefined && typeof showOnHomepage !== 'boolean') {
      console.log("Invalid showOnHomepage:", showOnHomepage)
      return NextResponse.json(
        { error: "showOnHomepage must be a boolean" },
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

    // Build update data object
    const updateData: any = {}
    if (status) updateData.status = status as any
    if (showOnHomepage !== undefined) updateData.showOnHomepage = showOnHomepage

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
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
