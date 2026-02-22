import type { Metadata } from "next"
import Image from "next/image"
import { Instagram } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out to The Alienic Project for orders, commissions, and inquiries.",
}

const faqItems = [
  {
    question: "How do I place an order?",
    answer:
      "All orders are handled personally. Reach out via Instagram DM (@alienicproject) or Telegram (@alienicproject) with the piece you desire. We will guide you through the sacred exchange.",
  },
  {
    question: "Do you accept custom commissions?",
    answer:
      "Yes. Custom work is the highest form of our craft. Share your vision, and together we will bring something unprecedented into existence. Commission timelines vary based on complexity.",
  },
  {
    question: "What are your shipping methods?",
    answer:
      "Each piece is wrapped like a relic and shipped with care. We offer tracked shipping worldwide. Delivery typically takes 7-14 business days, depending on your location in this realm.",
  },
  {
    question: "Can I return a piece?",
    answer:
      "Once a piece finds its keeper, the exchange is complete. However, if an artifact arrives damaged during its journey, we will make it right. Contact us within 48 hours of receiving your piece.",
  },
  {
    question: "What materials do you work with?",
    answer:
      "Sterling silver, oxidized metals, matte black steel, titanium, and occasionally rare materials like meteorite fragments. Each material is chosen for its ability to carry meaning and age beautifully.",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 noise-bg text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          Communion
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Reach Through the Veil
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          Whether you seek to acquire a piece, commission something unique, or
          simply share a thought — the gateway is open.
        </p>
      </section>

      {/* Two-column contact */}
      <section className="py-12 md:py-20 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-lg uppercase tracking-[0.3em] text-primary mb-6">
              Send a Message
            </h2>
            <ContactForm />
          </div>

          {/* Info & FAQ */}
          <div className="flex flex-col gap-10">
            {/* Direct Contact */}
            <div>
              <h2 className="text-lg uppercase tracking-[0.3em] text-primary mb-6">
                Direct Channels
              </h2>
              <div className="flex flex-col gap-4">
                <a
                  href="https://instagram.com/alienicproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <Instagram size={20} className="text-primary" />
                  <div>
                    <p className="text-lg text-foreground">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      @alienicproject
                    </p>
                  </div>
                </a>
                <a
                  href="https://t.me/alienicproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <div>
                    <p className="text-lg text-foreground">Telegram</p>
                    <p className="text-sm text-muted-foreground">
                      @alienicproject
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Business Card preview */}
            <div>
              <h2 className="text-lg uppercase tracking-[0.3em] text-primary mb-4">
                Our Seal
              </h2>
              <div className="relative aspect-[16/9] overflow-hidden border border-border">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Card-Back-X1PVYHVGorSMAgQgdLvYvxXCeD4hmJ.png"
                  alt="Alienic Project business card with QR code and social links"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Ordering instructions */}
            <div className="p-6 bg-card border border-border">
              <h3 className="text-lg uppercase tracking-[0.3em] text-primary mb-4">
                How to Order
              </h3>
              <ol className="flex flex-col gap-3 text-m text-muted-foreground list-decimal list-inside">
                <li>Browse the Shop and select your desired piece</li>
                <li>
                  Reach out via Instagram DM or Telegram with your selection
                </li>
                <li>
                  We confirm availability and discuss any customization
                </li>
                <li>Payment is arranged securely and personally</li>
                <li>
                  Your relic is carefully wrapped and shipped to your realm
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 px-6 bg-secondary">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Frequently Posed Questions
            </h2>
            <p className="font-[var(--font-fraktur)] text-3xl md:text-4xl text-foreground">
              Inquiries Answered
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group bg-card border border-border p-6 hover:border-primary/20 transition-all duration-300"
              >
                <summary className="cursor-pointer text-m uppercase tracking-[0.15em] text-foreground flex items-center justify-between list-none">
                  {item.question}
                  <span className="text-primary ml-4 group-open:rotate-45 transition-transform duration-300">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-m text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
