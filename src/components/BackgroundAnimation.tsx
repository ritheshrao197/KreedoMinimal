import React, { useEffect, useRef } from 'react'
import './BackgroundAnimation.css'

interface Star {
  x: number
  y: number
  z: number
  speed: number
  opacity: number
}

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initStars = () => {
      starsRef.current = []
      for (let i = 0; i < 100; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.9
        })
      }
    }

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      starsRef.current.forEach(star => {
        const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2
        const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2
        
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          const size = (1000 - star.z) / 1000 * 2
          const opacity = star.opacity * (1000 - star.z) / 1000
          
          // Create gradient for star glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
          gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`)
          gradient.addColorStop(0.5, `rgba(255, 122, 0, ${opacity * 0.5})`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, size * 2, 0, Math.PI * 2)
          ctx.fill()
          
          // Draw core star
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`
          ctx.beginPath()
          ctx.arc(x, y, Math.max(size * 0.5, 0.5), 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Move star towards viewer
        star.z -= star.speed
        
        // Reset star when it gets too close
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width
          star.y = Math.random() * canvas.height
          star.z = 1000
          star.opacity = 0.1 + Math.random() * 0.9
        }
      })
    }

    const animate = () => {
      drawStars()
      requestAnimationFrame(animate)
    }

    resizeCanvas()
    initStars()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initStars()
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="background-animation">
      <canvas ref={canvasRef} className="starfield-canvas" />
      
      <div className="animated-grid">
        <div className="grid-layer grid-primary"></div>
        <div className="grid-layer grid-secondary"></div>
      </div>
      
      <div className="floating-particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="energy-waves">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
    </div>
  )
}

export default BackgroundAnimation