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
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false)
    }, 3000)

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
    <div className="home">
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