"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
}

export function ImageZoom({ 
  src, 
  alt, 
  className = "",
  zoomScale = 2.5 
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Disable zoom on mobile devices
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    setZoomPosition({ x: xPercent, y: yPercent })
  }

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsZoomed(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Zoom overlay - only on desktop */}
      {!isMobile && isZoomed && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  )
}
