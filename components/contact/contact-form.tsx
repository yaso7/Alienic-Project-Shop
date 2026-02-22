"use client"

import { useState } from "react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p className="main-title text-2xl text-foreground mb-4">
          Your message echoes through the void
        </p>
        <p className="text-sm text-muted-foreground">
          We have received your transmission and shall respond with care.
          Patience, seeker.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("contact-name") as string
    const email = formData.get("contact-email") as string
    const subject = formData.get("contact-subject") as string
    const message = formData.get("contact-message") as string

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to send message")
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-name"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your Name
        </label>
        <input
          id="contact-name"
          name="contact-name"
          type="text"
          required
          placeholder="Enter your name"
          className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-email"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your Email
        </label>
        <input
          id="contact-email"
          name="contact-email"
          type="email"
          required
          placeholder="your@email.com"
          className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-subject"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Subject
        </label>
        <select
          id="contact-subject"
          name="contact-subject"
          className="bg-input border border-border px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
        >
          <option value="general">General Inquiry</option>
          <option value="order">Place an Order</option>
          <option value="commission">Custom Commission</option>
          <option value="collaboration">Collaboration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your Message
        </label>
        <textarea
          id="contact-message"
          name="contact-message"
          required
          rows={6}
          placeholder="Speak your truth..."
          className="bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="self-start px-8 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send Transmission"}
      </button>
    </form>
  )
}
