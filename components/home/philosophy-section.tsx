import Image from "next/image"
import Link from "next/link"

export function PhilosophySection() {
  return (
    <section className="py-24 md:py-32 px-6 noise-bg">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SC-%20Concept.1-Ee32igpxofdLPJjer1kWRmZ1zKmkV3.png"
              alt="Alienic concept art - abstract metallic star form"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-primary">
              Our Philosophy
            </h2>
            <p className="main-title text-3xl md:text-4xl text-foreground">
              More Than Product
            </p>
            <div className="gothic-divider w-24" />
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Welcome to the Alienic Project. I tend to create more than just
              products; I strive to craft pieces that resonate with
              individuality and authenticity.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              I believe that every purchase is a meaningful exchange, and I am
              honored to be a part of your journey.
            </p>
            <Link
              href="/about"
              className="mt-4 text-sm uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors duration-300 self-start"
            >
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
