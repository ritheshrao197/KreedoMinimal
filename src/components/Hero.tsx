import React, { useState, useEffect } from 'react'
import './Hero.css'

interface HeroProps {
  onPressStart: () => void
}

const Hero: React.FC<HeroProps> = ({ onPressStart }) => {
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 500)
    const timer2 = setTimeout(() => setSubtitleVisible(true), 1000)
    const timer3 = setTimeout(() => setButtonVisible(true), 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="grid-overlay"></div>
        <div className="glow-effect"></div>
      </div>
      
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className={`hero-title ${titleVisible ? 'visible' : ''}`}>
              <span className="title-line">KREEDO STUDIO</span>
            </h1>
            
            <p className={`hero-subtitle ${subtitleVisible ? 'visible' : ''}`}>
              Crafting Games. Creating Worlds.
            </p>
            
            <div className={`hero-actions ${buttonVisible ? 'visible' : ''}`}>
              <button 
                className="press-start-btn"
                onClick={onPressStart}
              >
                <span className="btn-text">
                  <span className="btn-icon">▶</span>
                  PRESS START
                </span>
                <div className="btn-glow"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-decorations">
        <div className="floating-element element-1">◆</div>
        <div className="floating-element element-2">✦</div>
        <div className="floating-element element-3">●</div>
        <div className="floating-element element-4">▲</div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-arrow">
          <span>↓</span>
        </div>
        <span className="scroll-text">SCROLL TO EXPLORE</span>
      </div>
    </section>
  )
}

export default Hero