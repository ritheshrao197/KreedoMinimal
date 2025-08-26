import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import Services from './Services'
import Games from './Games'
import About from './About'
import Contact from './Contact'
import GameFooter from './GameFooter'
import './Home.css'

const Home: React.FC = () => {
  const [showContent, setShowContent] = useState(false)

  const handlePressStart = () => {
    setShowContent(true)
    // Re-enable scrolling by removing CSS classes
    document.body.classList.remove('scroll-disabled')
    document.documentElement.classList.remove('scroll-disabled')
    
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Disable scrolling initially until Press Start is clicked
    if (!showContent) {
      document.body.classList.add('scroll-disabled')
      document.documentElement.classList.add('scroll-disabled')
      
      // Prevent scroll with keyboard (arrow keys, page up/down, space)
      const preventScroll = (e: KeyboardEvent) => {
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space']
        if (keys.includes(e.code)) {
          e.preventDefault()
        }
      }
      
      // Prevent wheel scroll
      const preventWheel = (e: WheelEvent) => {
        e.preventDefault()
      }
      
      // Prevent touch scroll
      const preventTouch = (e: TouchEvent) => {
        if (e.touches.length > 1) return // Allow pinch zoom
        e.preventDefault()
      }
      
      // Reset scroll position to top
      window.scrollTo(0, 0)
      
      document.addEventListener('keydown', preventScroll)
      document.addEventListener('wheel', preventWheel, { passive: false })
      document.addEventListener('touchmove', preventTouch, { passive: false })
      
      return () => {
        document.removeEventListener('keydown', preventScroll)
        document.removeEventListener('wheel', preventWheel)
        document.removeEventListener('touchmove', preventTouch)
      }
    } else {
      // Re-enable scrolling
      document.body.classList.remove('scroll-disabled')
      document.documentElement.classList.remove('scroll-disabled')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('scroll-disabled')
      document.documentElement.classList.remove('scroll-disabled')
    }
  }, [showContent])

  useEffect(() => {
    // Only add scroll listeners if content is shown
    if (!showContent) return

    // Fade in animations on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const fadeElements = document.querySelectorAll('.fade-in')
    fadeElements.forEach(el => observer.observe(el))
    
    return () => {
      fadeElements.forEach(el => observer.unobserve(el))
    }
  }, [showContent])

  useEffect(() => {
    // Check if content has been made visible externally (via navigation)
    const checkContentVisibility = () => {
      const mainContent = document.querySelector('.main-content')
      const homeContainer = document.querySelector('.home')
      
      if (mainContent?.classList.contains('visible') && 
          homeContainer?.classList.contains('content-visible') && 
          !showContent) {
        setShowContent(true)
      }
    }
    
    // Check periodically
    const interval = setInterval(checkContentVisibility, 100)
    
    return () => clearInterval(interval)
  }, [showContent])

  return (
    <div className={`home ${showContent ? 'content-visible' : ''}`}>
      <Hero onPressStart={handlePressStart} />
      
      <div className={`main-content ${showContent ? 'visible' : ''}`}>
        <Services />
        <Games />
        <About />
        <Contact />
        <GameFooter />
      </div>
    </div>
  )
}

export default Home