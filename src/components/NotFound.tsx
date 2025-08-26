import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import './NotFound.css'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const { playSound, addAchievement } = useGame()
  const [torchFlicker, setTorchFlicker] = useState(false)
  const [batsFlying, setBatsFlying] = useState(false)

  useEffect(() => {
    // Achievement for getting lost
    addAchievement({
      id: 'lost-explorer',
      title: 'Lost Explorer',
      description: 'Wandered into the unknown depths',
      icon: '🗺️'
    })

    // Torch flickering animation
    const flickerInterval = setInterval(() => {
      setTorchFlicker(true)
      setTimeout(() => setTorchFlicker(false), 200)
    }, 3000)

    // Occasional bat sounds and flying
    const batInterval = setInterval(() => {
      setBatsFlying(true)
      playSound('error')
      setTimeout(() => setBatsFlying(false), 2000)
    }, 8000)

    return () => {
      clearInterval(flickerInterval)
      clearInterval(batInterval)
    }
  }, [addAchievement, playSound])

  const handleReturn = () => {
    playSound('success')
    navigate('/')
  }

  const handleExplore = () => {
    playSound('click')
    // Add some random exploration achievements
    const explorationAchievements = [
      { id: 'brave-explorer', title: 'Brave Explorer', description: 'Chose to venture deeper', icon: '⚔️' },
      { id: 'treasure-seeker', title: 'Treasure Seeker', description: 'Always looking for adventure', icon: '💎' },
      { id: 'dungeon-master', title: 'Dungeon Master', description: 'Found the secret paths', icon: '🗝️' }
    ]
    const randomAchievement = explorationAchievements[Math.floor(Math.random() * explorationAchievements.length)]
    addAchievement(randomAchievement)
  }

  return (
    <div className="not-found">
      <div className="dungeon-background">
        <div className="stone-walls"></div>
        <div className="mist-overlay"></div>
        
        {/* Animated torches */}
        <div className={`torch torch-left ${torchFlicker ? 'flicker' : ''}`}>
          <div className="torch-flame">🔥</div>
        </div>
        <div className={`torch torch-right ${torchFlicker ? 'flicker' : ''}`}>
          <div className="torch-flame">🔥</div>
        </div>

        {/* Flying bats */}
        <div className={`bats ${batsFlying ? 'flying' : ''}`}>
          <span className="bat bat-1">🦇</span>
          <span className="bat bat-2">🦇</span>
          <span className="bat bat-3">🦇</span>
        </div>
      </div>

      <div className="dungeon-content">
        <div className="error-code">
          <span className="code-4">4</span>
          <span className="code-skull">💀</span>
          <span className="code-4">4</span>
        </div>

        <h1 className="dungeon-title">LOST IN THE DUNGEON</h1>
        
        <div className="dungeon-message">
          <p className="message-line">You've ventured too deep into uncharted territory...</p>
          <p className="message-line">The path you seek has been consumed by darkness.</p>
          <p className="message-line">But fear not, brave adventurer!</p>
        </div>

        <div className="dungeon-stats">
          <div className="stat-item">
            <span className="stat-icon">💙</span>
            <span className="stat-label">HP:</span>
            <span className="stat-value">???/???</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">XP:</span>
            <span className="stat-value">+100</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <span className="stat-label">Location:</span>
            <span className="stat-value">Unknown Depths</span>
          </div>
        </div>

        <div className="dungeon-actions">
          <button 
            className="action-btn return-btn"
            onClick={handleReturn}
            onMouseEnter={() => playSound('hover')}
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-text">Return to Safety</span>
          </button>
          
          <button 
            className="action-btn explore-btn"
            onClick={handleExplore}
            onMouseEnter={() => playSound('hover')}
          >
            <span className="btn-icon">🗡️</span>
            <span className="btn-text">Explore Further</span>
          </button>
        </div>

        <div className="dungeon-footer">
          <p className="footer-text">
            <span className="footer-icon">💡</span>
            Tip: Use the navigation above to find your way back to familiar lands
          </p>
        </div>

        {/* Decorative elements */}
        <div className="dungeon-decorations">
          <div className="spider-web web-1">🕸️</div>
          <div className="spider-web web-2">🕸️</div>
          <div className="treasure-chest">📦</div>
          <div className="skeleton">💀</div>
          <div className="crystal crystal-1">💎</div>
          <div className="crystal crystal-2">💎</div>
        </div>
      </div>
    </div>
  )
}

export default NotFound