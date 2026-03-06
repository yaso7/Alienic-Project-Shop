import Image from "next/image"
import { Instagram } from "lucide-react"

const previewImages = [
  {
    src: "https://a7waintojpncbj2p.public.blob.vercel-storage.com/P3.png",
    alt: "Alienic star on textured silver",
  },
  {
    src: "https://a7waintojpncbj2p.public.blob.vercel-storage.com/IMG_20250831_044015.jpg",
    alt: "Abstract metallic sculpture concept",
  },
  {
    src: "https://a7waintojpncbj2p.public.blob.vercel-storage.com/IMG_20251105_131151_115.webp",
    alt: "Alienic star on dark background",
  },
  {
    src: "https://a7waintojpncbj2p.public.blob.vercel-storage.com/IMG_20260223_174026_644.jpg",
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
            href="https://instagram.com/alienicbrand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 main-title text-2xl md:text-3xl text-foreground hover:text-primary transition-colors duration-300"
          >
            <Instagram size={28} />
            @alienicbrand
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {previewImages.map((image, index) => (
            <a
              key={index}
              href="https://instagram.com/alienicbrand"
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
