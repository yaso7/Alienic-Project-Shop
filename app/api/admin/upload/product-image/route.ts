import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  await requireAuth()

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `product-${timestamp}-${random}.${ext}`

    try {
      // Upload to Vercel Blob storage
      const blob = await put(filename, file, {
        access: 'public',
      })

      // Return the blob URL to be stored in DB
      return NextResponse.json({ imagePath: blob.url })
    } catch (e) {
      console.error("Upload error:", e)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
