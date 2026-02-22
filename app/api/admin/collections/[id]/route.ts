import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

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
      await prisma.collection.delete({
        where: { id },
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete collection" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
