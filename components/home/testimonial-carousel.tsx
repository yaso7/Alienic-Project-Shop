"use client"

import { Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Testimonial {
  id: string
  name: string
  location?: string | null
  rating: number
  text: string
  pieceAcquired?: string | null
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (testimonials.length <= 1) return

    // Start auto-scroll
    intervalRef.current = setInterval(() => {
      setIsAnimating(true) // Trigger animation
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % testimonials.length
        return nextIndex
      })
      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 100)
    }, 5000) // Change testimonial every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testimonials.length])

  const goToTestimonial = (index: number) => {
    if (isAnimating) return // Block manual navigation during animation
    
    setIsAnimating(true)
    setCurrentIndex(index)
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 100)

    // Reset interval when user manually navigates
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    }
  }

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length
    goToTestimonial(nextIndex)
  }

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    goToTestimonial(prevIndex)
  }

  if (testimonials.length === 0) {
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
                className="text-border"
              />
            ))}
          </div>

          <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
            "The piece arrived wrapped in black tissue like a relic from another world. It carries a weight that goes beyond the physical — you can feel the intention in every curve and edge."
          </blockquote>

          <div className="gothic-divider w-24 mx-auto mb-6" />

          <p className="text-lg text-primary tracking-wider">
            &mdash; A Keeper of Relics
          </p>

          <Link
            href="/testimonials"
            className="inline-block mt-10 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-105"
          >
            Read more confessionals &rarr;
          </Link>
        </div>
      </section>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-24 md:py-32 px-6 noise-bg">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-12">
          Confessional
        </h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[300px] flex items-center justify-center overflow-hidden">
          <div 
            key={currentIndex} // Force re-render when index changes
            className={`transition-all duration-1000 ease-in-out ${
              isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`transition-all duration-500 ${
                    i < currentTestimonial.rating
                      ? "fill-primary text-primary transform scale-100"
                      : "text-border transform scale-90"
                  }`}
                />
              ))}
            </div>

            <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
              {`"${currentTestimonial.text}"`}
            </blockquote>

            <div className="gothic-divider w-24 mx-auto mb-6" />

            <p className="text-lg text-primary tracking-wider">
              &mdash; {currentTestimonial.name}
              {currentTestimonial.location && `, ${currentTestimonial.location}`}
            </p>
            {currentTestimonial.pieceAcquired && (
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mt-2">
                {currentTestimonial.pieceAcquired}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentIndex
                      ? "bg-primary w-8 h-2 transform scale-110"
                      : "bg-border hover:bg-primary/50 w-2 h-2 hover:scale-125"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToNext()}
              className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-accent transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Next testimonial"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        <Link
          href="/testimonials"
          className="inline-block mt-10 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-105"
        >
          Read more confessionals &rarr;
        </Link>
      </div>
    </section>
  )
}
