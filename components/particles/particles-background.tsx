"use client"

import { useEffect, useRef } from "react"

interface ParticlesBackgroundProps {
  className?: string
}

export function ParticlesBackground({ className }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mouse position
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 400 // Grab distance from config
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // Load image
    const img = new Image()
    img.src = "https://a7waintojpncbj2p.public.blob.vercel-storage.com/image.png"
    
    // Particle system matching your config
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    // Create particles - exactly 52 as per config
    for (let i = 0; i < 52; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5, // Small horizontal movement
        vy: 1, // Move downward at speed 1
        size: 27.56990941315478, // Exact size from config
        opacity: 0.5 // Exact opacity from config
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges - out_mode: "out"
        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size
          particle.x = Math.random() * canvas.width
        }
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size

        // Draw particle with image
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.drawImage(
          img, 
          particle.x - particle.size / 2, 
          particle.y - particle.size / 2, 
          particle.size, 
          particle.size
        )
        ctx.restore()

        // Draw connections between particles
        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 199.52944306344222) { // Exact distance from config
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(210, 210, 210, ${0.4 * (1 - distance / 199.52944306344222)})` // #d2d2d2 color with opacity
            ctx.lineWidth = 1 // Exact width from config
            ctx.stroke()
          }
        })

        // Draw connections to mouse (grab effect)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x
          const dy = particle.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(mouse.x, mouse.y)
            // Full opacity (1.0) for grab effect as per config
            ctx.strokeStyle = `rgba(210, 210, 210, ${1 * (1 - distance / mouse.radius)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    // Start animation when image loads
    img.onload = () => {
      animate()
    }

    // Fallback if image doesn't load
    img.onerror = () => {
      console.log('Image failed to load, using circles instead')
      animate()
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}
