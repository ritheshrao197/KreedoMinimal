import React from 'react'
import { useGame } from '../contexts/GameContext'
import './GameControls.css'

const GameControls: React.FC = () => {
  const { soundEnabled, toggleSound, theme, toggleTheme, playSound } = useGame()

  const handleSoundToggle = () => {
    playSound('click')
    toggleSound()
  }

  const handleThemeToggle = () => {
    playSound('click')
    toggleTheme()
  }

  return (
    <div className="game-controls">
      <button
        className="control-btn sound-toggle"
        onClick={handleSoundToggle}
        title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
      >
        <span className="control-icon">
          {soundEnabled ? '🔊' : '🔇'}
        </span>
        <div className="control-indicator">
          <div className={`indicator-dot ${soundEnabled ? 'active' : ''}`}></div>
        </div>
      </button>

      <button
        className="control-btn theme-toggle"
        onClick={handleThemeToggle}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="control-icon">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
        <div className="control-indicator">
          <div className={`indicator-dot ${theme === 'dark' ? 'night' : 'day'}`}></div>
        </div>
      </button>
    </div>
  )
}

export default GameControls