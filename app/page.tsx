import { HeroSection } from "@/components/home/hero-section"
import { PhilosophySection } from "@/components/home/philosophy-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { InstagramSection } from "@/components/home/instagram-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PhilosophySection />
      <FeaturedSection />
      <TestimonialSection />
      <InstagramSection />
    </div>
  )
}
