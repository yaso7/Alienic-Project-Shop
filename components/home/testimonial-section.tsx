import { Star } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { TestimonialCarousel } from "./testimonial-carousel"

async function getHomepageTestimonials() {
  return await prisma.testimonial.findMany({
    where: { 
      status: "Approved",
      showOnHomepage: true
    },
    orderBy: { createdAt: "desc" },
    take: 10 // Limit to 10 for carousel performance
  })
}

export async function TestimonialSection() {
  const testimonials = await getHomepageTestimonials()
  return <TestimonialCarousel testimonials={testimonials} />
}
