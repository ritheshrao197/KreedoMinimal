import React from 'react'
import { useGame } from '../contexts/GameContext'
import './GameFooter.css'

const GameFooter: React.FC = () => {
  const { playSound, showAchievement } = useGame()

  const handleContactClick = () => {
    playSound('click')
    showAchievement({
      id: 'continue-game',
      title: 'Game Continues',
      description: 'Ready for the next level!',
      icon: '🎮'
    })
    
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const socialLinks = [
    { name: 'Discord', icon: '🎮', url: '#', color: 'var(--color-accent)' },
    { name: 'Twitter', icon: '🐦', url: '#', color: '#1DA1F2' },
    { name: 'GitHub', icon: '💻', url: '#', color: 'var(--color-text)' },
    { name: 'YouTube', icon: '📺', url: '#', color: '#FF0000' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: '#0077B5' }
  ]

  return (
    <footer className="game-footer">
      <div className="footer-glow-top"></div>
      
      <div className="footer-content">
        <div className="game-over-screen">
          <div className="game-over-header">
            <h2 className="game-over-title">
              <span className="title-glow">LEVEL COMPLETE</span>
            </h2>
            <p className="game-over-subtitle">
              Thanks for exploring our digital realm!
            </p>
          </div>

          <div className="score-display">
            <div className="score-item">
              <span className="score-label">EXPERIENCE GAINED</span>
              <span className="score-value">+999 XP</span>
            </div>
            <div className="score-item">
              <span className="score-label">KNOWLEDGE ACQUIRED</span>
              <span className="score-value">LEGENDARY</span>
            </div>
            <div className="score-item">
              <span className="score-label">STATUS</span>
              <span className="score-value status-ready">READY TO START</span>
            </div>
          </div>

          <div className="continue-section">
            <p className="continue-text">Ready to begin your project?</p>
            <button 
              className="continue-btn"
              onClick={handleContactClick}
              onMouseEnter={() => playSound('hover')}
            >
              <span className="btn-glow"></span>
              <span className="btn-text">CONTINUE TO NEXT LEVEL</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          <div className="social-tokens">
            <h3 className="tokens-title">Collect Social Tokens</h3>
            <div className="tokens-grid">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="social-token"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                  title={social.name}
                >
                  <span className="token-glow"></span>
                  <span className="token-icon">{social.icon}</span>
                  <span className="token-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-stats">
          <div className="stat-line">
            <span>BUILD VERSION</span>
            <span className="stat-value">v1.0.0 STABLE</span>
          </div>
          <div className="stat-line">
            <span>LAST UPDATE</span>
            <span className="stat-value">2024.08.26</span>
          </div>
          <div className="stat-line">
            <span>GAME ENGINE</span>
            <span className="stat-value">KREEDO ENGINE</span>
          </div>
        </div>

        <div className="footer-credits">
          <p className="copyright">
            © 2024 Kreedo Studio. All rights reserved.
            <br />
            <span className="flavor-text">
              "Every pixel tells a story. Every interaction creates magic."
            </span>
          </p>
          
          <div className="easter-egg-hint">
            <span className="hint-text">
              🎮 Try the Konami Code: ↑↑↓↓←→←→BA+Enter
            </span>
          </div>
        </div>
      </div>

      <div className="footer-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="footer-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </footer>
  )
}

export default GameFooter