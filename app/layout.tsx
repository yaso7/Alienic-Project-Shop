import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, UnifrakturMaguntia } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LayoutWrapper } from '@/components/layout-wrapper'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const fraktur = UnifrakturMaguntia({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-fraktur',
})


export const metadata: Metadata = {
  title: {
    default: 'Alienic Project | Every Piece Woes a Tale',
    template: '%s | Alienic Project',
  },
  description:
    'Handcrafted gothic and metallic artisan pieces. Every purchase is a meaningful exchange.',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stamp%20%282%29-OQLcMTwasYk5b1pU7FenDxjZwtPx4V.png',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stamp%20%282%29-OQLcMTwasYk5b1pU7FenDxjZwtPx4V.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stamp%20%282%29-OQLcMTwasYk5b1pU7FenDxjZwtPx4V.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${fraktur.variable}`}>
      <body className="font-serif antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
