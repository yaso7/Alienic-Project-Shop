import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  await requireAuth()
  
  try {
    // Simple count check
    const productCount = await prisma.product.count()
    console.log('Product count:', productCount)
    
    // Try to fetch products without images first
    const productsWithoutImages = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true
      }
    })
    
    console.log('Products without images:', productsWithoutImages)
    
    // Try to fetch with images
    const productsWithImages = await prisma.product.findMany({
      take: 5,
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    console.log('Products with images:', productsWithImages)
    
    return NextResponse.json({
      count: productCount,
      productsWithoutImages,
      productsWithImages
    })
  } catch (error) {
    console.error('Test products error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch test products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
