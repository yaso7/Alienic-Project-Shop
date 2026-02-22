import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    prisma.collection.findMany({
      orderBy: { order: "asc" },
    }),
  ])

  if (!product) {
    notFound()
  }

  async function updateProduct(formData: FormData) {
    "use server"
    const { prisma } = await import("@/lib/prisma")
    
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const material = formData.get("material") as string
    const collectionId = formData.get("collectionId") as string
    const story = formData.get("story") as string
    const image = formData.get("image") as string
    const isFeatured = formData.get("isFeatured") === "on"
    const isAvailable = formData.get("isAvailable") === "on"

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        category: category as any,
        price,
        material,
        collectionId: collectionId || null,
        story,
        image,
        isFeatured,
        isAvailable,
      },
    })

    redirect("/admin/products")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Edit Product
        </h1>
      </div>

      <ProductForm action={updateProduct} product={product} collections={collections} />
    </div>
  )
}
