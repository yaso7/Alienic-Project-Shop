"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export function ReviewForm() {
  const [rating, setRating] = useState(0) // No default rating
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <p className="main-title text-2xl text-foreground mb-4">
          Your words have been received
        </p>
        <p className="text-sm text-muted-foreground">
          Like an inscription on ancient stone, your confessional shall
          endure. We are grateful.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = (formData.get("name") as string)?.trim()
    const location = (formData.get("location") as string)?.trim()
    const product = (formData.get("product") as string)?.trim()
    const review = (formData.get("review") as string)?.trim()

    // Debug logging
    console.log('Testimonial Form Data:', {
      name,
      location,
      product,
      rating,
      review,
      ratingValue: rating,
      formDataEntries: Array.from(formData.entries())
    })

    if (!name || name.length === 0) {
      setError("Name is required")
      setLoading(false)
      return
    }

    if (!review || review.length === 0) {
      setError("Please share your experience")
      setLoading(false)
      return
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a valid rating (1-5 stars)")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location: location || undefined,
          rating,
          text: review,
          product: product || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to submit review")
        setLoading(false)
        console.log('API Error Response:', data)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl flex flex-col gap-6"
    >
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Your Rating *
        </label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${starValue} stars`}
              >
                <Star
                  size={24}
                  className={
                    i < (hoverRating || rating)
                      ? "fill-primary text-primary transition-colors"
                      : "text-border transition-colors"
                  }
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
            onChange={(e) => console.log('Name input value:', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="location"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City, Country"
            className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="product"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Piece Acquired
        </label>
        <input
          id="product"
          name="product"
          type="text"
          placeholder="Which piece do you carry?"
          className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="review"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your Confessional
        </label>
        <textarea
          id="review"
          name="review"
          required
          rows={5}
          placeholder="Share your experience with the piece..."
          className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="self-center px-8 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Confessional"}
      </button>
    </form>
  )
}
