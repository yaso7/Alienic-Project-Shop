import { getCurrentAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      console.log("BLOB_READ_WRITE_TOKEN present:", !!process.env.BLOB_READ_WRITE_TOKEN)
      console.log("Uploading file:", filename, "Size:", file.size, "Type:", file.type)
      
      // Upload to Vercel Blob storage
      const blob = await put(filename, file, {
        access: 'private',
      })

      console.log("Upload successful:", blob.url)
      // Return the blob URL to be stored in DB
      return NextResponse.json({ imagePath: blob.url })
    } catch (e: any) {
      console.error("Upload error:", e.message || e)
      console.error("Full upload error:", e)
      return NextResponse.json({ error: "Upload failed", details: e.message }, { status: 500 })
    }
  } catch (e: any) {
    console.error("Request error:", e.message || e)
    return NextResponse.json({ error: "Request failed", details: e.message }, { status: 500 })
  }
}
