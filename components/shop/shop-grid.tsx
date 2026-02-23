"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { X, Instagram, ChevronLeft, ChevronRight } from "lucide-react"
import { ImageZoom } from "@/components/ui/image-zoom"

interface Product {
  id: string
  name: string
  price: string
  material: string
  collection: { title: string } | null
  story: string
  image: string
  images?: Array<{ id: string; imageUrl: string; order: number }>
  dbCategory?: { name: string } | null
}

interface ShopGridProps {
  products: Array<{
    id: string
    name: string
    price: string
    material: string
    collection: { title: string } | null
    story: string
    image: string
    images?: Array<{ id: string; imageUrl: string; order: number }>
    dbCategory?: { name: string } | null
  }>
  categories: Array<{ id: string; name: string; slug: string }>
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const productImages = product.images?.map(img => img.imageUrl) || [product.image]
  const currentImage = productImages[currentImageIndex]
  
  function nextImage() {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }
  
  function previousImage() {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    
    document.addEventListener('keydown', handleEsc)
    document.addEventListener('keydown', handleArrowKeys)
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('keydown', handleArrowKeys)
    }
  }, [onClose, productImages.length])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm rounded-full p-2"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative">
            <div className="relative aspect-[9/16]">
              <ImageZoom
                src={currentImage}
                alt={product.name}
                className="w-full h-full"
              />
              
              {/* Navigation arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground rounded-full p-2 hover:bg-background/90 transition-colors z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground rounded-full p-2 hover:bg-background/90 transition-colors z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Image indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? 'bg-primary'
                          : 'bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-8 overflow-y-auto">
            {product.collection && (
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {product.collection.title}
              </p>
            )}
            <h2 className="main-title text-4xl text-foreground">
              {product.name}
            </h2>
            <p className="text-2xl text-primary">{product.price}</p>
            <div className="gothic-divider w-full" />

            <div className="flex flex-col gap-1">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Material
              </p>
              <p className="text-m text-foreground">{product.material}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                The Tale
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.story}
              </p>
            </div>

            <div className="gothic-divider w-full" />

            <p className="text-sm text-muted-foreground italic">
              To acquire this piece, reach out via Instagram or Telegram.
              Each transaction is personal and handled with care.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <a
                href="https://instagram.com/alienicproject"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
              >
                <Instagram size={16} />
                Inquire on Instagram
              </a>
              <a
                href="https://t.me/alienicproject"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
              >
                Inquire on Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShopGrid({ products, categories }: ShopGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => {
          // Use the category name from the database relationship
          const categoryName = p.dbCategory?.name
          return categoryName === activeCategory
        })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Debug logging
  console.log('ShopGrid Debug:', {
    totalProducts: products.length,
    activeCategory,
    filteredProducts: filteredProducts.length,
    totalPages,
    currentPage,
    startIndex,
    paginatedProducts: paginatedProducts.length,
    products: products.map(p => ({ id: p.id, name: p.name, categoryName: p.dbCategory?.name }))
  })

  return (
    <>
      {/* Filters */}
      <section className="py-8 px-6 border-b border-border">
        <div className="mx-auto max-w-6xl flex flex-wrap justify-center gap-4">
          {/* All button */}
          <button
            onClick={() => {
              setActiveCategory("All")
              setCurrentPage(1) // Reset to first page when changing category
            }}
            className={`text-xs uppercase tracking-[0.2em] px-4 py-2 transition-all duration-300 ${
              activeCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            All
          </button>
          
          {/* Dynamic category buttons */}
          {categories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.name)
                  setCurrentPage(1) // Reset to first page when changing category
                }}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 transition-all duration-300 ${
                  activeCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-6 bg-secondary">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available in this category.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group text-left bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images?.[0]?.imageUrl || product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                {product.images && product.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded">
                    +{product.images.length - 1} more
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                {product.collection && (
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {product.collection.title}
                  </p>
                )}
                <h3 className="main-title text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-xl text-primary">{product.price}</p>
                <p className="text-m text-muted-foreground mt-1">
                  {product.material}
                </p>
              </div>
            </button>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 px-6 bg-secondary">
          <div className="mx-auto max-w-6xl flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
