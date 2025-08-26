import React, { useState, useEffect } from 'react'
import './Navigation.css'

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('.navigation')
      if (nav && !nav.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const scrollToSection = (id: string) => {
    // First, ensure content is visible by removing scroll-disabled classes
    document.body.classList.remove('scroll-disabled')
    document.documentElement.classList.remove('scroll-disabled')
    
    // Show main content by adding the visible class
    const mainContent = document.querySelector('.main-content')
    const homeContainer = document.querySelector('.home')
    
    if (mainContent && !mainContent.classList.contains('visible')) {
      mainContent.classList.add('visible')
    }
    
    if (homeContainer && !homeContainer.classList.contains('content-visible')) {
      homeContainer.classList.add('content-visible')
    }
    
    // Small delay to ensure content is rendered before scrolling
    setTimeout(() => {
      if (id === 'home') {
        // For home, scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 100)
    
    // Close mobile menu after navigation
    setMobileMenuOpen(false)
  }

  const handleNavClick = (id: string) => {
    scrollToSection(id)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">KREEDO</span>
          <span className="logo-subtitle">STUDIO</span>
        </div>
        
        {/* Mobile menu toggle */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="nav-item">
            <button 
              onClick={() => handleNavClick('home')} 
              className="nav-link"
            >
              <span className="nav-text">HOME</span>
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => handleNavClick('services')} 
              className="nav-link"
            >
              <span className="nav-text">SERVICES</span>
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => handleNavClick('games')} 
              className="nav-link"
            >
              <span className="nav-text">GAMES</span>
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => handleNavClick('about')} 
              className="nav-link"
            >
              <span className="nav-text">ABOUT</span>
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => handleNavClick('contact')} 
              className="nav-link"
            >
              <span className="nav-text">CONTACT</span>
            </button>
          </li>
        </ul>

        <div className="nav-status">
          <span className="status-indicator"></span>
          <span className="status-text">ONLINE</span>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setMobileMenuOpen(false)}
          onTouchStart={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}

export default Navigation