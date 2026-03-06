"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductSelect } from "@/components/admin/product-select"
import Link from "next/link"
import { useEffect } from "react"

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  mood: z.string().optional(),
  heroImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.coerce.number().default(0),
  productIds: z.array(z.string()).optional(),
})

type CollectionFormData = z.infer<typeof collectionSchema>

interface CollectionFormProps {
  action: (formData: FormData) => Promise<void>
  collection?: {
    title: string
    slug: string
    subtitle: string | null
    description: string
    shortDescription: string | null
    mood: string[]
    heroImage: string | null
    order: number
    products?: Array<{
      id: string
      name: string
      slug: string
    }>
  }
}

export function CollectionForm({ action, collection }: CollectionFormProps) {
  const methods = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
      ? {
          title: collection.title,
          slug: collection.slug,
          subtitle: collection.subtitle || "",
          description: collection.description,
          shortDescription: collection.shortDescription || "",
          mood: collection.mood.join(", "),
          heroImage: collection.heroImage || "",
          order: collection.order,
          productIds: collection.products?.map(p => p.id) || [],
        }
      : undefined,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = methods

  // Auto-generate slug from title (same approach as product form)
  const titleValue = watch("title")
  const slugValue = watch("slug")
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  
  useEffect(() => {
    if (!collection && titleValue) { // Only auto-generate for new collections when titleValue exists
      setValue("slug", generateSlug(titleValue))
    }
  }, [titleValue, setValue, collection])

  async function onSubmit(data: CollectionFormData) {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("slug", data.slug)
    formData.append("subtitle", data.subtitle || "")
    formData.append("description", data.description)
    formData.append("shortDescription", data.shortDescription || "")
    formData.append("mood", data.mood || "")
    formData.append("heroImage", data.heroImage || "")
    formData.append("order", data.order.toString())
    if (data.productIds) {
      formData.append("productIds", JSON.stringify(data.productIds))
    }
    await action(formData)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Collection Details</TabsTrigger>
            <TabsTrigger value="products">Products (Optional)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input 
                id="slug" 
                {...register("slug")} 
                placeholder="collection-i-2024"
                disabled={!!collection}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (auto-generated for new collections)
              </p>
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                {...register("subtitle")}
                placeholder="Collection I — 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={6}
                placeholder="Describe the collection..."
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                {...register("shortDescription")}
                rows={2}
                placeholder="Brief description for featured sections..."
              />
              <p className="text-xs text-muted-foreground">
                Used in the featured section on the homepage
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood Tags</Label>
              <Input
                id="mood"
                {...register("mood")}
                placeholder="Ancient, Weathered, Sacred (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated mood keywords
              </p>
            </div>

            {/* Hero Image temporarily hidden
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image URL *</Label>
              <Input
                id="heroImage"
                {...register("heroImage")}
                type="url"
                placeholder="https://..."
              />
              {errors.heroImage && (
                <p className="text-sm text-destructive">{errors.heroImage.message}</p>
              )}
            </div>
            */}

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                {...register("order")}
                type="number"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Optionally select products to include in this collection. Products can be added or removed later.
              </p>
              <ProductSelect 
                name="productIds"
                label="Select Products"
                placeholder="Search and select products..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : collection ? "Update Collection" : "Create Collection"}
          </Button>
          <Link href="/admin/collections">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </FormProvider>
  )
}
