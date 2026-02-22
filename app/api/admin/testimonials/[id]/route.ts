import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params
  const { status } = await request.json()

  if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    )
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { status: status as any },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}
