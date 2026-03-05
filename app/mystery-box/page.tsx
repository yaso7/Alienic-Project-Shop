'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Instagram, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  bundleSize: 'Small' | 'Medium' | 'Large'
  design: 'Simple' | 'Extra' | "IDontCare"
  stylePreference: 'Masculine' | 'Feminine' | 'IDontCare'
  neckMeasurements: string
  wristMeasurements: string
  colorPreference: string
  notes: string
  username: string
}

export default function MysteryBoxPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    bundleSize: 'Small',
    design: 'Simple',
    stylePreference: "IDontCare",
    neckMeasurements: '',
    wristMeasurements: '',
    colorPreference: '',
    notes: '',
    username: '',
  })

  const bundleSizePrices = {
    Small: 10,
    Medium: 15,
    Large: 30
  }

  const designPrices = {
    Simple: 0,
    Extra: 10,
    IDontCare: 5
  }

  const bundleSizeDescriptions = {
    Small: 'Pendant & Earring',
    Medium: 'Pendant & Armlet & Earring & Ring',
    Large: '7 Random Relics'
  }

  const basePrice = 0
  const currentPrice = basePrice + bundleSizePrices[formData.bundleSize] + designPrices[formData.design]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const orderData = {
      title: `Mystery Box - ${formData.bundleSize}`,
      bundleSize: formData.bundleSize,
      design: formData.design,
      stylePreference: formData.stylePreference,
      neckMeasurements: formData.neckMeasurements,
      wristMeasurements: formData.wristMeasurements,
      colorPreference: formData.colorPreference || null,
      notes: formData.notes || null,
      username: formData.username,
      price: currentPrice,
      status: 'Pending' as const,
    }

    try {
      const response = await fetch('/api/mystery-boxes/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Order Submitted Successfully!",
          description: result.message || "Mystery box order submitted successfully! We will contact you soon.",
        })
        setFormData({
          bundleSize: 'Small',
          design: 'Simple',
          stylePreference: "IDontCare",
          neckMeasurements: '',
          wristMeasurements: '',
          colorPreference: '',
          notes: '',
          username: '',
        })
      } else {
        toast({
          title: "Order Failed",
          description: result.error || "Failed to submit order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      toast({
        title: "Order Failed",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 noise-bg text-center">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Shop
        </Link>
        <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          The Mystery
        </h2>
        <h1 className="hero-title text-4xl md:text-6xl text-foreground mb-6">
          Mystery Box
        </h1>
        <div className="gothic-divider w-48 mx-auto mb-6" />
        <p className="max-w-lg mx-auto text-lg text-muted-foreground leading-relaxed">
          A curated collection of handcrafted relics, chosen just for you.
          Each box contains unique pieces with mysterious origins.
        </p>
      </section>

      {/* Product Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Image */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-square relative overflow-hidden rounded-lg border border-border">
              <Image
                src="https://a7waintojpncbj2p.public.blob.vercel-storage.com/Hot_Topic_Accessories_Goth_Mystery_Box_Color_Black_Purple_Size_Os.jfif"
                alt="Mystery Box"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div>
              <h2 className="main-title text-4xl text-foreground mb-2">
                Mystery Box
              </h2>
              <p className="text-2xl text-primary">${currentPrice.toFixed(2)}</p>
            </div>

            <div className="gothic-divider w-full" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Bundle Size */}
              <div className="flex flex-col gap-3">
                <label className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Bundle Size ({bundleSizeDescriptions[formData.bundleSize]})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(bundleSizeDescriptions).map(([size, description]) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bundleSize: size as any }))}
                      className={`px-4 py-3 text-sm uppercase tracking-[0.1em] border transition-all duration-300 ${
                        formData.bundleSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design */}
              <div className="flex flex-col gap-3">
                <label className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Design
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.keys(designPrices).map((design) => (
                    <button
                      key={design}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, design: design as any }))}
                      className={`px-4 py-3 text-sm uppercase tracking-[0.1em] border transition-all duration-300 flex items-center justify-center text-center ${
                        formData.design === design
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {design === 'IDontCare' ? "I don't care" : design}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Preference */}
              <div className="flex flex-col gap-3">
                <label className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Style Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Masculine', 'Feminine', 'IDontCare'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, stylePreference: style }))}
                      className={`px-4 py-3 text-sm uppercase tracking-[0.1em] border transition-all duration-300 flex items-center justify-center text-center ${
                        formData.stylePreference === style
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {style === 'IDontCare' ? "I don't care" : style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="neckMeasurements" className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Neck Measurements
                  </label>
                  <input
                    id="neckMeasurements"
                    type="text"
                    value={formData.neckMeasurements}
                    onChange={(e) => setFormData(prev => ({ ...prev, neckMeasurements: e.target.value }))}
                    className="px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="30 cm / 12 inch"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="wristMeasurements" className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Wrist Measurements
                  </label>
                  <input
                    id="wristMeasurements"
                    type="text"
                    value={formData.wristMeasurements}
                    onChange={(e) => setFormData(prev => ({ ...prev, wristMeasurements: e.target.value }))}
                    className="px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="15 cm / 6 inch"
                    required
                  />
                </div>
              </div>

              {/* Color Preference */}
              <div className="flex flex-col gap-2">
                <label htmlFor="colorPreference" className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Color Preference
                </label>
                <input
                  id="colorPreference"
                  type="text"
                  value={formData.colorPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorPreference: e.target.value }))}
                  className="px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Optional"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Instagram/Telegram Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="@username"
                  required
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="px-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Any special requests or preferences..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300"
              >
                Order Mystery Box - ${currentPrice.toFixed(2)}
              </button>
            </form>

            <div className="gothic-divider w-full" />

            <p className="text-sm text-muted-foreground italic">
              Each mystery box is uniquely curated based on your preferences.
              Processing time is 3-7 business days. You will be contacted with updates.
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com/alienicbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
              >
                <Instagram size={16} />
                Questions? Instagram
              </a>
              <a
                href="https://t.me/AlienicBrand"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground text-sm uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300"
              >
                <Send size={16} />
                Questions? Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
