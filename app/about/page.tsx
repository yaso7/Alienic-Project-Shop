import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Alienic Project — handcrafted gothic and metallic artisan pieces.",
}

const processStages = [
  {
    number: "I",
    title: "Vision",
    description:
      "Each piece begins as a whisper in the dark — an idea born from the intersection of ancient aesthetics and futuristic form. I draw from the gothic, the cosmic, and the deeply personal.",
  },
  {
    number: "II",
    title: "Forge",
    description:
      "Raw materials are transformed through careful manipulation — oxidized silver, matte black metals, and textured surfaces are shaped by hand, each imperfection a mark of authenticity.",
  },
  {
    number: "III",
    title: "Ritual",
    description:
      "The final piece is not merely finished — it is consecrated. Packaged like a relic, delivered like an offering. From my hands to yours, completing the sacred exchange.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6 noise-bg">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.Sticker-%20Logo-zkFcGsmctG92tbpbE9EKeUL5Jrkz5d.png"
                alt="Alienic Project logo - white star and gothic text on black"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary">
                The Artisan
              </h2>
              <h1 className="hero-title text-4xl md:text-5xl text-foreground">
                Behind the Veil
              </h1>
              <div className="gothic-divider w-24" />
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Welcome to the Alienic Project. I tend to create more than just
                products; I strive to craft pieces that resonate with
                individuality and authenticity.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                I believe that every purchase is a meaningful exchange, and I am
                honored to be a part of your journey. Each piece carries a
                fragment of something otherworldly — a bridge between the
                ancient and the unknown.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                In a world of mass production, I choose the slow path. Every
                scratch, every oxidation, every texture is deliberate. These
                are not merely objects — they are talismans for those who walk
                between worlds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 px-6 bg-secondary">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              The Sacred Process
            </h2>
            <p className="hero-title text-3xl md:text-5xl text-foreground">
              From Void to Form
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {processStages.map((stage) => (
              <div key={stage.number} className="flex flex-col items-center text-center gap-4">
                <span className="font-[var(--font-fraktur)] text-5xl text-primary/30">
                  {stage.number}
                </span>
                <h3 className="font-[var(--font-fraktur)] text-2xl text-foreground">
                  {stage.title}
                </h3>
                <div className="gothic-divider w-16" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 px-6 noise-bg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-8">
            Expanded Philosophy
          </h2>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stamp%20%282%29-OQLcMTwasYk5b1pU7FenDxjZwtPx4V.png"
            alt="Alienic seal"
            width={80}
            height={80}
            className="mx-auto mb-8 invert opacity-60"
          />
          <p className="hero-title text-3xl md:text-4xl text-foreground mb-8">
            Every Piece Woes a Tale
          </p>
          <div className="gothic-divider w-24 mx-auto mb-8" />
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            The Alienic Project exists in the liminal space between art and
            artifact. Each creation is a meditation on impermanence — the
            beauty found in surfaces that bear the marks of transformation.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            Oxidized silver tells the story of time. Matte black absorbs the
            noise of the modern world. Gothic forms recall an era when
            craftsmanship was sacred, when every object carried intention.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            When you hold an Alienic piece, you hold a bridge between two
            worlds — the ancient and the alien, the familiar and the unknown.
            This is not decoration. This is devotion made tangible.
          </p>
        </div>
      </section>
    </div>
  )
}
