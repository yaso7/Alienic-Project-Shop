"use client"

import { Star } from "lucide-react"
import { ReviewForm } from "@/components/testimonials/review-form"
import { ImageModal } from "@/components/testimonials/image-modal"
import { useState, useEffect } from "react"

interface Testimonial {
  id: string
  name: string
  location?: string | null
  rating: number
  text: string
  pieceAcquired?: string | null
  image?: {
    id: string
    url: string
    altText?: string | null
  } | null
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; altText: string } | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials")
        if (response.ok) {
          const data = await response.json()
          setTestimonials(data)
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const openImageModal = (imageUrl: string, altText: string) => {
    setSelectedImage({ url: imageUrl, altText })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-muted-foreground">Loading testimonials...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 noise-bg text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          The Confessional
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Voices in the Dark
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          Those who carry an Alienic piece carry a story. Here, they share
          their confessionals.
        </p>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-6 bg-secondary">
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No testimonials available yet.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl columns-1 md:columns-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="break-inside-avoid mb-8 flex flex-col gap-4 p-8 bg-card border border-border hover:border-primary/20 transition-all duration-500"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < testimonial.rating
                          ? "fill-primary text-primary"
                          : "text-border"
                      }
                    />
                  ))}
                </div>

                <blockquote className="text-lg text-muted-foreground leading-relaxed italic">
                  {`"${testimonial.text}"`}
                </blockquote>

                {/* Small square image */}
                {testimonial.image && (
                  <div className="mt-4 flex justify-left">
                    <div 
                      className="w-20 h-20 overflow-hidden rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => openImageModal(testimonial.image!.url, testimonial.image!.altText || `Photo from ${testimonial.name}`)}
                    >
                      <img
                        src={testimonial.image.url}
                        alt={testimonial.image.altText || `Photo from ${testimonial.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="gothic-divider w-full" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-m text-foreground font-medium">
                      {testimonial.name}
                    </p>
                    {testimonial.location && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                  {testimonial.pieceAcquired && (
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">
                      {testimonial.pieceAcquired}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit a Review */}
      <section className="py-24 md:py-32 px-6 noise-bg">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Share Your Tale
          </h2>
          <p className="font-[var(--font-fraktur)] text-3xl md:text-4xl text-foreground mb-4">
            Leave a Confessional
          </p>
          <p className="text-lg text-muted-foreground">
            Your voice joins the chorus of those who have been touched by
            these creations.
          </p>
        </div>
        <ReviewForm />
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={modalOpen}
          onClose={closeModal}
          imageUrl={selectedImage.url}
          altText={selectedImage.altText}
        />
      )}
    </div>
  )
}
