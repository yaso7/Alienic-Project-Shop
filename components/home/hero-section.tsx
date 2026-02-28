"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden noise-bg">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PFP-White-Yab1gmXrg4upN6ybuve3oAVG39odZF.png"
          alt="Alienic star symbol"
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <Image
          src="https://a7waintojpncbj2p.public.blob.vercel-storage.com/Black.png"
          alt="Alienic Project Seal"
          width={120}
          height={120}
          priority
          className={`invert opacity-80 ${isMounted ? 'animate-in fade-in duration-1000' : ''}`}
        />

        <h1 className={`hero-title text-5xl md:text-7xl lg:text-8xl text-foreground tracking-wider ${isMounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300' : ''}`}>
          Alienic
        </h1>

        <p className={`text-lg md:text-xl text-primary tracking-[0.3em] uppercase ${isMounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500' : ''}`}>
          Every piece woes a tale
        </p>

        <div className={`gothic-divider w-48 ${isMounted ? 'animate-in fade-in duration-1000 delay-700' : ''}`} />

        <p className={`description-text max-w-lg text-muted-foreground leading-relaxed ${isMounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700' : ''}`}>
          Handcrafted gothic and metallic artisan pieces, forged with reverence
          and imbued with meaning.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 mt-4 ${isMounted ? 'animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000' : ''}`}>
          <Link
            href="/shop"
            className="px-8 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
          >
            Enter the Shop
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${isMounted ? 'animate-bounce' : ''}`}>
        <ArrowDown size={20} className="text-muted-foreground" />
      </div>
    </section>
  )
}
