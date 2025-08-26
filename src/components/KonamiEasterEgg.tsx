import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import TicTacToe from '../games/TicTacToe'
import SnakeGame from '../games/SnakeGame'
import MemoryMatch from '../games/MemoryMatch'
import Game2048 from '../games/Game2048'
import './KonamiEasterEgg.css'

const KonamiEasterEgg: React.FC = () => {
  const { showEasterEgg, setShowEasterEgg, playSound } = useGame()
  const [selectedGame, setSelectedGame] = useState<'tic-tac-toe' | 'snake' | 'memory-match' | '2048' | null>(null)
  const [easterEggStats, setEasterEggStats] = useState({
    timesActivated: parseInt(localStorage.getItem('konami-activations') || '0'),
    gamesPlayed: parseInt(localStorage.getItem('konami-games-played') || '0')
  })

  useEffect(() => {
    if (showEasterEgg) {
      const newActivations = easterEggStats.timesActivated + 1
      setEasterEggStats(prev => ({ ...prev, timesActivated: newActivations }))
      localStorage.setItem('konami-activations', newActivations.toString())
      playSound('achievement')
    }
  }, [showEasterEgg, easterEggStats.timesActivated, playSound])

  const handleGameSelect = (game: 'tic-tac-toe' | 'snake' | 'memory-match' | '2048') => {
    setSelectedGame(game)
    playSound('click')
    const newGamesPlayed = easterEggStats.gamesPlayed + 1
    setEasterEggStats(prev => ({ ...prev, gamesPlayed: newGamesPlayed }))
    localStorage.setItem('konami-games-played', newGamesPlayed.toString())
  }

  const handleClose = () => {
    setShowEasterEgg(false)
    setSelectedGame(null)
    playSound('click')
  }

  const handleBackToMenu = () => {
    setSelectedGame(null)
    playSound('click')
  }

  const getGameTitle = () => {
    switch (selectedGame) {
      case 'tic-tac-toe': return '🎯 Tic Tac Toe'
      case 'snake': return '🐍 Kreedo Snake'
      case 'memory-match': return '🧠 Memory Match'
      case '2048': return '🎮 2048 Quest'
      default: return ''
    }
  }

  const renderGame = () => {
    switch (selectedGame) {
      case 'tic-tac-toe': return <TicTacToe />
      case 'snake': return <SnakeGame />
      case 'memory-match': return <MemoryMatch />
      case '2048': return <Game2048 />
      default: return null
    }
  }

  if (!showEasterEgg) return null

  return (
    <div className="konami-easter-egg">
      <div className="easter-egg-overlay" onClick={handleClose}>
        <div className="easter-egg-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>

          {!selectedGame ? (
            <div className="easter-egg-menu">
              <div className="easter-egg-header">
                <h2 className="easter-egg-title">
                  🎉 SECRET ARCADE UNLOCKED! 🎉
                </h2>
                <p className="easter-egg-subtitle">
                  Congratulations! You discovered the Konami Code!
                </p>
                <div className="easter-egg-code">
                  <span className="code-sequence">↑ ↑ ↓ ↓ ← → ← → B A</span>
                </div>
              </div>

              <div className="easter-egg-stats">
                <div className="stat-item">
                  <span className="stat-icon">🔓</span>
                  <div className="stat-info">
                    <span className="stat-number">{easterEggStats.timesActivated}</span>
                    <span className="stat-label">Times Unlocked</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🎮</span>
                  <div className="stat-info">
                    <span className="stat-number">{easterEggStats.gamesPlayed}</span>
                    <span className="stat-label">Games Played</span>
                  </div>
                </div>
              </div>

              <div className="game-selection">
                <h3 className="selection-title">Choose Your Game</h3>
                <div className="game-options">
                  <button 
                    className="game-option" 
                    onClick={() => handleGameSelect('tic-tac-toe')}
                  >
                    <div className="option-icon">🎯</div>
                    <div className="option-info">
                      <h4>Tic Tac Toe</h4>
                      <p>Classic strategy game</p>
                    </div>
                    <div className="option-arrow">→</div>
                  </button>

                  <button 
                    className="game-option" 
                    onClick={() => handleGameSelect('snake')}
                  >
                    <div className="option-icon">🐍</div>
                    <div className="option-info">
                      <h4>Kreedo Snake</h4>
                      <p>Collect orange tokens!</p>
                    </div>
                    <div className="option-arrow">→</div>
                  </button>

                  <button 
                    className="game-option" 
                    onClick={() => handleGameSelect('memory-match')}
                  >
                    <div className="option-icon">🧠</div>
                    <div className="option-info">
                      <h4>Memory Match</h4>
                      <p>Test your memory skills</p>
                    </div>
                    <div className="option-arrow">→</div>
                  </button>

                  <button 
                    className="game-option" 
                    onClick={() => handleGameSelect('2048')}
                  >
                    <div className="option-icon">🎮</div>
                    <div className="option-info">
                      <h4>2048 Quest</h4>
                      <p>Merge tiles to reach 2048!</p>
                    </div>
                    <div className="option-arrow">→</div>
                  </button>
                </div>
              </div>

              <div className="easter-egg-footer">
                <p className="footer-message">
                  🎊 You are now part of the elite Konami Club! 🎊
                </p>
                <p className="footer-hint">
                  Share this secret with fellow gamers!
                </p>
              </div>
            </div>
          ) : (
            <div className="easter-egg-game">
              <div className="game-header">
                <button className="back-btn" onClick={handleBackToMenu}>
                  ← Back to Arcade
                </button>
                <h3 className="current-game-title">
                  {getGameTitle()}
                </h3>
              </div>
              
              <div className="game-container">
                {renderGame()}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Celebration particles */}
      <div className="celebration-particles">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="celebration-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🎉', '🎊', '⭐', '✨', '🏆'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KonamiEasterEgg