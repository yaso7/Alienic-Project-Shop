import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"
import { revalidatePath } from "next/cache"

export default async function NewProductPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { order: "asc" },
  })

  async function createProduct(formData: FormData) {
    "use server"
    const { prisma } = await import("@/lib/prisma")
    
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const categoryId = formData.get("categoryId") as string
    const price = formData.get("price") as string
    const priceNumeric = parseFloat(price.replace(/[^0-9.]/g, '')) || 0
    const material = formData.get("material") as string
    const collectionId = formData.get("collectionId") as string
    const story = formData.get("story") as string
    const image = formData.get("image") as string
    const images = formData.get("images") as string
    const isFeatured = formData.get("isFeatured") === "on"
    const isAvailable = formData.get("isAvailable") === "on"

    const imageUrls = images ? JSON.parse(images) : [image]

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId: categoryId || null,
        price,
        priceNumeric,
        material,
        collectionId: collectionId || null,
        story,
        image,
        isFeatured,
        isAvailable,
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            imageUrl: url,
            order: index,
          }))
        }
      },
      include: {
        images: true
      }
    })

    // Revalidate cache for shop and home pages
    revalidatePath('/shop')
    revalidatePath('/')

    redirect("/admin/products")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          New Product
        </h1>
      </div>

      <ProductForm action={createProduct} collections={collections} />
    </div>
  )
}
