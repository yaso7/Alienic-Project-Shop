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
import { X, Plus } from "lucide-react"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  material: z.string().min(1, "Material is required"),
  collectionId: z.string().optional(),
  story: z.string().min(1, "Story is required"),
  image: z.string().min(1, "At least one image is required"),
  images: z.array(z.string()).optional(),
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
    categoryId: string | null
    price: string
    material: string
    collectionId: string | null
    story: string
    image: string
    images?: string[]
    isFeatured: boolean
    isAvailable: boolean
  }
  collections: Array<{ id: string; title: string }>
}

export function ProductForm({ action, product, collections }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [productImages, setProductImages] = useState<string[]>(product?.images || (product?.image ? [product.image] : []))
  const [uploading, setUploading] = useState(false)
  
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
          categoryId: product.categoryId || "",
          price: product.price,
          material: product.material,
          collectionId: product.collectionId || "",
          story: product.story,
          image: product.image,
          isFeatured: product.isFeatured,
          isAvailable: product.isAvailable,
        }
      : {
          categoryId: "",
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

  // Auto-generate slug from name
  const nameValue = watch("name")
  const slugValue = watch("slug")
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  
  useEffect(() => {
    if (!product && nameValue) { // Only auto-generate for new products when nameValue exists
      setValue("slug", generateSlug(nameValue))
    }
  }, [nameValue, setValue, product])

  const categoryId = watch("categoryId")
  const isFeatured = watch("isFeatured")
  const isAvailable = watch("isAvailable")
  const imagePath = watch("image")
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || productImages[0] || null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
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
        return data.imagePath
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const newImages = [...productImages, ...uploadedImages]
      setProductImages(newImages)
      
      // Set the first image as the main image if none is set
      if (!imagePath || imagePath === product?.image) {
        setValue("image", uploadedImages[0])
        setImagePreview(uploadedImages[0])
      }
      
      setValue("images", newImages)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  function removeImage(index: number) {
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)
    setValue("images", newImages)
    
    // Update main image if necessary
    if (imagePreview === productImages[index]) {
      const newMainImage = newImages[0] || ""
      setValue("image", newMainImage)
      setImagePreview(newMainImage)
    }
  }

  function setAsMainImage(imageUrl: string) {
    setValue("image", imageUrl)
    setImagePreview(imageUrl)
  }

  async function onSubmit(data: ProductFormData) {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("slug", data.slug)
    formData.append("categoryId", data.categoryId || "")
    formData.append("price", data.price)
    formData.append("material", data.material)
    formData.append("collectionId", data.collectionId || "")
    formData.append("story", data.story)
    formData.append("image", data.image)
    formData.append("images", JSON.stringify(productImages))
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
          <Input 
            id="slug" 
            {...register("slug")} 
            placeholder="the-void-pendant"
            disabled={!product}
          />
          <p className="text-sm text-muted-foreground">
            URL-friendly identifier (auto-generated for new products)
          </p>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => setValue("categoryId", value)}
            disabled={loadingCategories}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
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
          <Input 
            id="price" 
            {...register("price")} 
            placeholder="$85" 
            onChange={(e) => {
              const value = e.target.value
              if (!value.startsWith('$') && value) {
                e.target.value = `$${value}`
              }
              register("price").onChange(e)
            }}
          />
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
        <Label htmlFor="image">Product Images *</Label>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={uploading}
              />
              {errors.image && (
                <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
              )}
              {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
            </div>
          </div>
          
          {productImages.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Image Preview ({productImages.length} images)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded border-2 transition-all"
                        style={{
                          borderColor: imageUrl === imagePreview ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setAsMainImage(imageUrl)}
                        className={`text-xs px-2 py-1 rounded ${
                          imageUrl === imagePreview
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {imageUrl === imagePreview ? 'Main' : 'Set Main'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
