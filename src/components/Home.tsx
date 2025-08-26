import React, { useEffect, useState } from 'react'
import { useGame } from '../contexts/GameContext'
import Hero from './Hero'
import Services from './Services'
import Games from './Games'
import About from './About'
import Contact from './Contact'
import GameFooter from './GameFooter'
import './Home.css'

const Home: React.FC = () => {
  const [showContent, setShowContent] = useState(false)
  const { showAchievement, setLoading } = useGame()

  const handlePressStart = () => {
    setShowContent(true)
    // Re-enable scrolling by removing CSS classes
    document.body.classList.remove('scroll-disabled')
    document.documentElement.classList.remove('scroll-disabled')
    
    showAchievement({
      id: 'journey-begins',
      title: 'The Journey Begins',
      description: 'Welcome to Kreedo Studio!',
      icon: '🚀'
    })
    
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
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false)
    }, 3000)

    // Only add scroll listeners if content is shown
    if (!showContent) return

    // Track scroll-based achievements
    const handleScroll = () => {
      const sections = ['services', 'games', 'about', 'contact']
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId)
        if (section) {
          const rect = section.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5
          
          if (isVisible && !section.dataset.achieved) {
            section.dataset.achieved = 'true'
            
            const achievements = {
              services: {
                id: 'services-discovered',
                title: 'Quest Seeker',
                description: 'Discovered our services!',
                icon: '⚔️'
              },
              games: {
                id: 'arcade-found',
                title: 'Arcade Master',
                description: 'Found the playable games!',
                icon: '🕹️'
              },
              about: {
                id: 'team-met',
                title: 'Guild Member',
                description: 'Met our team!',
                icon: '👥'
              },
              contact: {
                id: 'portal-found',
                title: 'Portal Discoverer',
                description: 'Found the communication portal!',
                icon: '🌀'
              }
            }
            
            if (achievements[sectionId as keyof typeof achievements]) {
              showAchievement(achievements[sectionId as keyof typeof achievements])
            }
          }
        }
      })
    }

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

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      fadeElements.forEach(el => observer.unobserve(el))
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showContent, showAchievement, setLoading])

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