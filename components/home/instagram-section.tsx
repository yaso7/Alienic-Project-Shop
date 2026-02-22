import Image from "next/image"
import { Instagram } from "lucide-react"

const previewImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-Black-PrwFTaDbWXZr9S6Y5KiouNx5x0YhKZ.png",
    alt: "Alienic star on textured silver",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SC-%20Concept.1-Ee32igpxofdLPJjer1kWRmZ1zKmkV3.png",
    alt: "Abstract metallic sculpture concept",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png",
    alt: "Alienic star on dark background",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Card-Front-m3BoQOivskc8izgiDAkRwaU9IqcqJB.png",
    alt: "Alienic business card design",
  },
]

export function InstagramSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-secondary">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            From the Archive
          </h2>
          <a
            href="https://instagram.com/alienicproject"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 main-title text-2xl md:text-3xl text-foreground hover:text-primary transition-colors duration-300"
          >
            <Instagram size={28} />
            @alienicproject
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {previewImages.map((image, index) => (
            <a
              key={index}
              href="https://instagram.com/alienicproject"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={24}
                  className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
