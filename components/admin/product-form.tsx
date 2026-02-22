"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  material: z.string().min(1, "Material is required"),
  collectionId: z.string().optional(),
  story: z.string().min(1, "Story is required"),
  image: z.string().min(1, "Image is required"),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>
  product?: {
    name: string
    slug: string
    category: string
    price: string
    material: string
    collectionId: string | null
    story: string
    image: string
    isFeatured: boolean
    isAvailable: boolean
  }
  collections: Array<{ id: string; title: string }>
}

export function ProductForm({ action, product, collections }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          category: product.category as any,
          price: product.price,
          material: product.material,
          collectionId: product.collectionId || "",
          story: product.story,
          image: product.image,
          isFeatured: product.isFeatured,
          isAvailable: product.isAvailable,
        }
      : {
          category: "",
          isAvailable: true,
        },
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const category = watch("category")
  const isFeatured = watch("isFeatured")
  const isAvailable = watch("isAvailable")
  const imagePath = watch("image")
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  const [uploading, setUploading] = useState(false)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload/product-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Upload failed:", errorData)
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await res.json()
      setValue("image", data.imagePath)
      setImagePreview(data.imagePath)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: ProductFormData) {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("slug", data.slug)
    formData.append("category", data.category)
    formData.append("price", data.price)
    formData.append("material", data.material)
    formData.append("collectionId", data.collectionId || "")
    formData.append("story", data.story)
    formData.append("image", data.image)
    formData.append("isFeatured", data.isFeatured ? "on" : "")
    formData.append("isAvailable", data.isAvailable ? "on" : "")
    await action(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register("slug")} placeholder="the-void-pendant" />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue("category", value)}
            disabled={loadingCategories}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingCategories && (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input id="price" {...register("price")} placeholder="$85" />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material">Material *</Label>
        <Input id="material" {...register("material")} placeholder="Oxidized Sterling Silver" />
        {errors.material && (
          <p className="text-sm text-destructive">{errors.material.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="collectionId">Collection</Label>
        <Select
          value={watch("collectionId") || ""}
          onValueChange={(value) => setValue("collectionId", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a collection (optional)" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Story *</Label>
        <Textarea
          id="story"
          {...register("story")}
          rows={6}
          placeholder="Describe the piece..."
        />
        {errors.story && (
          <p className="text-sm text-destructive">{errors.story.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image *</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
            {errors.image && (
              <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
            )}
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
          {imagePreview && (
            <div className="relative w-24 h-24">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={(checked) => setValue("isFeatured", checked)}
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isAvailable"
            checked={isAvailable}
            onCheckedChange={(checked) => setValue("isAvailable", checked)}
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Link href="/admin/products">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}
