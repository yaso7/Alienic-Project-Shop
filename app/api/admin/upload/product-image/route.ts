import { requireAuth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

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

    // Create directory path
    const uploadsDir = join(process.cwd(), "public", "media", "images", "products")
    await mkdir(uploadsDir, { recursive: true })

    // Write file
    const filepath = join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    // Return the path to be stored in DB
    const imagePath = `/media/images/products/${filename}`

    return NextResponse.json({ imagePath })
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
