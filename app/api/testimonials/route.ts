import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { put } from "@vercel/blob"

const testimonialSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  text: z.string().min(1),
  product: z.string().optional(),
})

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: "Approved" },
      include: {
        image: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const rating = formData.get("rating") as string
    const text = formData.get("text") as string
    const product = formData.get("product") as string
    const imageFile = formData.get("image") as File | null

    // Validate form data
    const data = testimonialSchema.parse({
      name,
      location: location || undefined,
      rating: parseInt(rating),
      text,
      product: product || undefined,
    })

    let testimonialImage: string | null = null

    // Handle image upload if present
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload an image." },
          { status: 400 }
        )
      }

      // Validate file size (5MB limit)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size must be less than 5MB" },
          { status: 400 }
        )
      }

      try {
        // Generate unique filename
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(7)
        const ext = imageFile.name.split(".").pop() || "jpg"
        const filename = `testimonial-${timestamp}-${random}.${ext}`

        // Upload to Vercel Blob storage
        const blob = await put(filename, imageFile, {
          access: 'public',
        })

        testimonialImage = blob.url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        )
      }
    }

    // Create testimonial image record if image was uploaded
    let imageId: string | undefined
    if (testimonialImage) {
      const imageRecord = await prisma.testimonialImage.create({
        data: {
          url: testimonialImage,
          altText: `Photo submitted by ${data.name}`,
          fileSize: imageFile?.size,
          mimeType: imageFile?.type,
        },
      })
      imageId = imageRecord.id
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        location: data.location || null,
        rating: data.rating,
        text: data.text,
        pieceAcquired: data.product || null,
        imageId: imageId || null,
        source: "Form",
        status: "Pending",
      },
      include: {
        image: true,
      },
    })

    // Create notification for new testimonial
    await prisma.notification.create({
      data: {
        type: "testimonial",
        referenceId: testimonial.id,
        title: `New testimonial from ${data.name}`,
        body: `${data.rating}★ review${testimonialImage ? ' with photo' : ''}`,
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
