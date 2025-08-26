import React from 'react'
import { useGame } from '../contexts/GameContext'
import './AchievementPopup.css'

const AchievementPopup: React.FC = () => {
  const { achievements, dismissAchievement, playSound } = useGame()

  const handleDismiss = (timestamp: number) => {
    dismissAchievement(timestamp)
  }

  const handleTouchStart = () => {
    playSound('hover')
  }

  return (
    <div className="achievement-container">
      {achievements.map((achievement) => (
        <div key={achievement.timestamp} className="achievement-wrapper">
          <div className="achievement-overlay"></div>
          <div 
            className="achievement-popup"
            onClick={() => handleDismiss(achievement.timestamp)}
            onTouchStart={handleTouchStart}
            role="button"
            tabIndex={0}
            aria-label="Close achievement notification"
          >
            <button 
              className="achievement-close-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDismiss(achievement.timestamp)
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleTouchStart()
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="achievement-glow"></div>
            <div className="achievement-content">
              <div className="achievement-icon">
                <span>{achievement.icon}</span>
              </div>
              <div className="achievement-info">
                <div className="achievement-header">
                  <span className="achievement-label">ACHIEVEMENT UNLOCKED</span>
                </div>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <p className="achievement-hint">Tap to dismiss</p>
              </div>
            </div>
            <div className="achievement-particles">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="achievement-particle"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    left: `${10 + (i % 4) * 25}%`,
                    animationDuration: `${1.5 + (i % 3) * 0.5}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AchievementPopup