import React from 'react'
import { useGame } from '../contexts/GameContext'
import './AchievementPopup.css'

const AchievementPopup: React.FC = () => {
  const { achievements } = useGame()

  return (
    <div className="achievement-container">
      {achievements.map((achievement) => (
        <div key={achievement.timestamp} className="achievement-popup">
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
      ))}
    </div>
  )
}

export default AchievementPopup