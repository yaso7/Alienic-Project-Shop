import { Star } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getFeaturedTestimonial() {
  return await prisma.testimonial.findFirst({
    where: { status: "Approved" },
    orderBy: { createdAt: "desc" }
  })
}

export async function TestimonialSection() {
  const testimonial = await getFeaturedTestimonial()
  return (
    <section className="py-24 md:py-32 px-6 noise-bg">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-12">
          Confessional
        </h2>

        <div className="flex justify-center gap-1 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                testimonial && i < testimonial.rating
                  ? "fill-primary text-primary"
                  : "text-border"
              }
            />
          ))}
        </div>

        <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
          {testimonial ? `"${testimonial.text}"` : '"The piece arrived wrapped in black tissue like a relic from another world. It carries a weight that goes beyond the physical — you can feel the intention in every curve and edge."'}
        </blockquote>

        <div className="gothic-divider w-24 mx-auto mb-6" />

        <p className="text-lg text-primary tracking-wider">
          &mdash; {testimonial ? testimonial.name : "A Keeper of Relics"}
        </p>

        <Link
          href="/testimonials"
          className="inline-block mt-10 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          Read more confessionals &rarr;
        </Link>
      </div>
    </section>
  )
}
