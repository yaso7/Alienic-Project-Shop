import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"
import { revalidatePath } from "next/cache"
import { getCurrentAdmin } from "@/lib/auth"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const currentAdmin = await getCurrentAdmin()
  const { id } = await params
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
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
    const categoryId = formData.get("categoryId") as string
    const price = formData.get("price") as string
    const priceNumeric = parseFloat(price.replace(/[^0-9.]/g, '')) || 0
    const material = formData.get("material") as string
    const collectionId = formData.get("collectionId") as string
    const story = formData.get("story") as string
    const image = formData.get("image") as string
    const images = formData.get("images") as string
    const isFeatured = formData.get("isFeatured") === "on"
    const madeBy = formData.get("madeBy") as string
    const addedBy = formData.get("addedBy") as string
    const status = formData.get("status") as string
    const customer = formData.get("customer") as string
    const isCustom = formData.get("isCustom") === "on"

    const imageUrls = images ? JSON.parse(images) : [image]

    // First, delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: id }
    })

    // Then update product and create new images
    const updatedProduct = await prisma.product.update({
      where: { id },
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
        status: status as "Available" | "NotAvailable" | "Archived" | "Draft",
        isCustom,
        customer: customer || null,
        madeBy: madeBy || null,
        addedBy: addedBy || null,
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            imageUrl: url,
            order: index,
          }))
        }
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
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
          Edit Product
        </h1>
      </div>

      <ProductForm action={updateProduct} product={{
    ...product,
    images: product.images.map(img => img.imageUrl)
  }} collections={collections} currentAdminId={currentAdmin?.id} />
    </div>
  )
}
