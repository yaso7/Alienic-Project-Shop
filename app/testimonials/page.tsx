import type { Metadata } from "next"
import { Star } from "lucide-react"
import { ReviewForm } from "@/components/testimonials/review-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read confessionals from those who carry Alienic pieces — and share your own tale.",
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "Approved" },
    include: { 
      product: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
  })
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
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex flex-col gap-4 p-8 bg-card border border-border hover:border-primary/20 transition-all duration-500"
              >
                {/* Image display */}
                {testimonial.image && (
                  <div className="w-full h-48 overflow-hidden rounded-lg border border-border">
                    <img
                      src={testimonial.image.url}
                      alt={testimonial.image.altText || `Photo from ${testimonial.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

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
                  {testimonial.product && (
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">
                      {testimonial.product.name}
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
    </div>
  )
}
