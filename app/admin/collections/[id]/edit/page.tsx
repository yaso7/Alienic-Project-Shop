import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CollectionForm } from "@/components/admin/collection-form"
import { revalidatePath } from "next/cache"

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const collection = await prisma.collection.findUnique({
    where: { id },
  })

  if (!collection) {
    notFound()
  }

  async function updateCollection(formData: FormData) {
    "use server"
    const { prisma } = await import("@/lib/prisma")
    
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const subtitle = formData.get("subtitle") as string
    const description = formData.get("description") as string
    const shortDescription = formData.get("shortDescription") as string
    const moodString = formData.get("mood") as string
    const heroImage = formData.get("heroImage") as string
    const order = parseInt(formData.get("order") as string) || 0

    const mood = moodString
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean)

    await prisma.collection.update({
      where: { id },
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        description,
        shortDescription: shortDescription || null,
        mood,
        heroImage,
        order,
      },
    })

    // Revalidate cache for home page (featured collections)
    revalidatePath('/')

    redirect("/admin/collections")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Edit Collection
        </h1>
      </div>

      <CollectionForm action={updateCollection} collection={collection} />
    </div>
  )
}
