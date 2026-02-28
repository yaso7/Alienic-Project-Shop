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
import { X, Plus, Glasses } from "lucide-react"

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
  status: z.enum(["Available", "NotAvailable", "Archived", "Draft"]).default("Available"),
  isCustom: z.boolean().default(false),
  customer: z.string().optional(),
  madeBy: z.string().optional(),
  addedBy: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface Admin {
  id: string
  email: string
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
    status: "Available" | "NotAvailable" | "Archived" | "Draft"
    isCustom: boolean
    customer?: string | null
    madeBy?: string | null
    addedBy?: string | null
  }
  collections: Array<{ id: string; title: string }>
  currentAdminId?: string
}

export function ProductForm({ action, product, collections, currentAdminId }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingAdmins, setLoadingAdmins] = useState(true)
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
          status: product.status,
          isCustom: product.isCustom,
          customer: product.customer || "",
          madeBy: product.madeBy || "",
          addedBy: product.addedBy || "",
        }
      : {
          categoryId: "",
          status: "Available",
          isCustom: false,
          addedBy: currentAdminId || "",
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

    async function fetchAdmins() {
      try {
        const response = await fetch('/api/admin/admins')
        if (response.ok) {
          const data = await response.json()
          setAdmins(data.admins || [])
        }
      } catch (error) {
        console.error('Failed to fetch admins:', error)
      } finally {
        setLoadingAdmins(false)
      }
    }

    fetchCategories()
    fetchAdmins()
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
  const status = watch("status")
  const isCustom = watch("isCustom")
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
    formData.append("status", data.status)
    formData.append("isCustom", data.isCustom ? "on" : "")
    formData.append("customer", data.customer || "")
    formData.append("madeBy", data.madeBy || "")
    formData.append("addedBy", data.addedBy || currentAdminId || "")
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="madeBy">Made By</Label>
          <Select
            value={watch("madeBy") || ""}
            onValueChange={(value) => setValue("madeBy", value || undefined)}
            disabled={loadingAdmins}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingAdmins ? "Loading admins..." : "Select admin (optional)"} />
            </SelectTrigger>
            <SelectContent>
              {admins.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingAdmins && (
            <p className="text-sm text-muted-foreground">Loading admins...</p>
          )}
          <p className="text-sm text-muted-foreground">Jamie is watching.. <Glasses className="inline h-3 w-3 ml-1" /></p>
        </div>

        {!product && (
          <div className="space-y-2">
            <Label htmlFor="addedBy">Added By</Label>
            <Input
              id="addedBy"
              {...register("addedBy")}
              value={currentAdminId ? admins.find(a => a.id === currentAdminId)?.email || currentAdminId : ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">Automatically set to current admin</p>
          </div>
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

      <div className="space-y-6">
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
              id="isCustom"
              checked={isCustom}
              onCheckedChange={(checked) => setValue("isCustom", checked)}
            />
            <Label htmlFor="isCustom">Custom Product</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue("status", value as "Available" | "NotAvailable" | "Archived" | "Draft")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="NotAvailable">Not Available</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input
                id="customer"
                {...register("customer")}
                placeholder="Customer name or username"
              />
              <p className="text-sm text-muted-foreground">
                Enter the customer's name or username for custom products
              </p>
            </div>
          )}
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
