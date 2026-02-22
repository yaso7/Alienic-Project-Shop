"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  mood: z.string().optional(),
  heroImage: z.string().url("Must be a valid URL"),
  order: z.coerce.number().default(0),
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
    heroImage: string
    order: number
  }
}

export function CollectionForm({ action, collection }: CollectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
      ? {
          title: collection.title,
          slug: collection.slug,
          subtitle: collection.subtitle || "",
          description: collection.description,
          shortDescription: collection.shortDescription || "",
          mood: collection.mood.join(", "),
          heroImage: collection.heroImage,
          order: collection.order,
        }
      : undefined,
  })

  async function onSubmit(data: CollectionFormData) {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("slug", data.slug)
    formData.append("subtitle", data.subtitle || "")
    formData.append("description", data.description)
    formData.append("shortDescription", data.shortDescription || "")
    formData.append("mood", data.mood || "")
    formData.append("heroImage", data.heroImage)
    formData.append("order", data.order.toString())
    await action(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" {...register("slug")} placeholder="collection-i-2024" />
        <p className="text-xs text-muted-foreground">
          URL-friendly identifier (lowercase, hyphens only)
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

      <div className="flex gap-4">
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
  )
}
