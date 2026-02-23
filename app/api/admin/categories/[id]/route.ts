import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (e) {
    console.error('Category fetch error', e)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params

  try {
    const body = await request.json()
    const { name, slug, description } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json(category)
  } catch (e: any) {
    console.error('Category update error', e)
    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth()
  const { id } = await params

  try {
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Category delete error', e)
    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'Foreign key constraint violation: Cannot delete category with associated products' },
        { status: 400 }
      )
    }
    if (e.message && e.message.includes('foreign key constraint')) {
      return NextResponse.json(
        { error: 'Cannot delete category because it has products associated with it' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
