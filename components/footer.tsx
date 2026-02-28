import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image
              src="https://a7waintojpncbj2p.public.blob.vercel-storage.com/Black.png"
              alt="Alienic Project Logo"
              width={60}
              height={60}
              className="invert opacity-70"
            />
            <p className="main-title site-font hero-title text-4xl text-foreground">
              Alienic
            </p>
            <p className="text-m text-muted-foreground italic">
              Every piece woes a tale
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-m uppercase tracking-[0.3em] text-primary mb-2">
              Navigate
            </h3>
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/projects", label: "Projects" },
              { href: "/shop", label: "Shop" },
              { href: "/testimonials", label: "Testimonials" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-m text-muted-foreground hover:text-primary transition-colors duration-300 tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="text-m uppercase tracking-[0.3em] text-primary mb-2">
              Connect
            </h3>
            <a
              href="https://instagram.com/alienicbrand"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-m text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Instagram size={16} />
              <span>@alienicbrand</span>
            </a>
            <a
              href="https://t.me/AlienicBrand"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-m text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              <span>@AlienicBrand</span>
            </a>
          </div>
        </div>

        <div className="gothic-divider mt-12 mb-8" />

        <p className="text-center text-xs text-muted-foreground tracking-widest uppercase">
          {"The Alienic Project"} &mdash; {"Handcrafted with reverence"}
        </p>
      </div>
    </footer>
  )
}
