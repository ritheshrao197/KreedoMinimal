import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import './SimonSays.css'

type Color = 'red' | 'blue' | 'green' | 'yellow'
type GameStatus = 'waiting' | 'showing' | 'input' | 'gameover'

const SimonSays: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerInput, setPlayerInput] = useState<Color[]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [level, setLevel] = useState(0)
  const [activeButton, setActiveButton] = useState<Color | null>(null)
  const [scores, setScores] = useState({ 
    highScore: parseInt(localStorage.getItem('simon-high-score') || '0'),
    currentStreak: 0,
    totalGames: parseInt(localStorage.getItem('simon-total-games') || '0')
  })
  const [showingIndex, setShowingIndex] = useState(0)
  
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const colors: Color[] = ['red', 'blue', 'green', 'yellow']
  
  const colorSounds = {
    red: 262,    // C4
    blue: 330,   // E4
    green: 392,  // G4
    yellow: 523  // C5
  }

  const playColorSound = useCallback((color: Color, duration = 300) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(colorSounds[color], audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + duration / 1000)
    } catch (error) {
      playSound('click')
    }
  }, [playSound])

  const startGame = useCallback(() => {
    setSequence([])
    setPlayerInput([])
    setLevel(0)
    setGameStatus('showing')
    setScores(prev => ({ 
      ...prev, 
      currentStreak: 0,
      totalGames: prev.totalGames + 1
    }))
    localStorage.setItem('simon-total-games', (scores.totalGames + 1).toString())
    
    // Add first color to sequence
    const firstColor = colors[Math.floor(Math.random() * colors.length)]
    setSequence([firstColor])
    setShowingIndex(0)
    
    playSound('success')
  }, [colors, playSound, scores.totalGames])

  const showSequence = useCallback((seq: Color[]) => {
    setGameStatus('showing')
    setShowingIndex(0)
    
    let index = 0
    const showNext = () => {
      if (index < seq.length) {
        setActiveButton(seq[index])
        playColorSound(seq[index])
        setShowingIndex(index)
        
        timeoutRef.current = setTimeout(() => {
          setActiveButton(null)
          timeoutRef.current = setTimeout(() => {
            index++
            showNext()
          }, 200)
        }, 600)
      } else {
        setGameStatus('input')
        setPlayerInput([])
      }
    }
    
    // Start showing sequence after a short delay
    timeoutRef.current = setTimeout(showNext, 500)
  }, [playColorSound])

  const handleColorClick = useCallback((color: Color) => {
    if (gameStatus !== 'input') return

    const newPlayerInput = [...playerInput, color]
    setPlayerInput(newPlayerInput)
    
    setActiveButton(color)
    playColorSound(color, 200)
    
    setTimeout(() => setActiveButton(null), 200)

    // Check if input matches sequence so far
    const isCorrect = sequence[newPlayerInput.length - 1] === color
    
    if (!isCorrect) {
      // Game over
      setGameStatus('gameover')
      playSound('click')
      
      showAchievement({
        id: 'simon-gameover',
        title: 'Game Over!',
        description: `You reached level ${level + 1}. Try again!`,
        icon: '❌'
      })
      
      // Update high score
      const finalScore = level + 1
      if (finalScore > scores.highScore) {
        setScores(prev => ({ ...prev, highScore: finalScore }))
        localStorage.setItem('simon-high-score', finalScore.toString())
        
        showAchievement({
          id: 'simon-high-score',
          title: 'New High Score!',
          description: `Level ${finalScore} - Amazing memory!`,
          icon: '🏆'
        })
      }
      
      return
    }

    // Check if player completed the sequence
    if (newPlayerInput.length === sequence.length) {
      const newLevel = level + 1
      setLevel(newLevel)
      setScores(prev => ({ ...prev, currentStreak: newLevel }))
      
      // Level up achievement
      if (newLevel % 5 === 0) {
        showAchievement({
          id: `simon-level-${newLevel}`,
          title: 'Memory Master!',
          description: `Reached level ${newLevel}!`,
          icon: '🧠'
        })
      }
      
      playSound('achievement')
      
      // Add new color to sequence
      const nextColor = colors[Math.floor(Math.random() * colors.length)]
      const newSequence = [...sequence, nextColor]
      setSequence(newSequence)
      
      // Show the updated sequence after a short delay
      timeoutRef.current = setTimeout(() => {
        showSequence(newSequence)
      }, 1000)
    }
  }, [gameStatus, playerInput, sequence, level, scores.highScore, playColorSound, playSound, showAchievement, showSequence, colors])

  const resetStats = useCallback(() => {
    setScores({ highScore: 0, currentStreak: 0, totalGames: 0 })
    localStorage.setItem('simon-high-score', '0')
    localStorage.setItem('simon-total-games', '0')
    playSound('click')
  }, [playSound])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const getButtonClass = (color: Color) => {
    let className = `simon-button ${color}`
    if (activeButton === color) className += ' active'
    if (gameStatus === 'showing') className += ' showing'
    return className
  }

  const getGameStatusText = () => {
    switch (gameStatus) {
      case 'waiting': return 'Press START to begin'
      case 'showing': return `Watch the sequence... (${showingIndex + 1}/${sequence.length})`
      case 'input': return `Repeat the sequence (${playerInput.length}/${sequence.length})`
      case 'gameover': return 'Game Over - Try Again!'
      default: return ''
    }
  }

  return (
    <div className="simon-game">
      <div className="game-header">
        <h2 className="game-title">
          <span className="title-icon">🧠</span>
          Simon Says
        </h2>
        <p className="game-description">
          Watch the sequence of colors, then repeat it back. How far can your memory take you?
        </p>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level + 1}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">High Score</span>
          <span className="stat-value">{scores.highScore}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Games Played</span>
          <span className="stat-value">{scores.totalGames}</span>
        </div>
      </div>

      <div className="game-status">
        <p className="status-text">{getGameStatusText()}</p>
        {gameStatus === 'input' && sequence.length > 0 && (
          <div className="sequence-progress">
            <div 
              className="progress-bar"
              style={{ width: `${(playerInput.length / sequence.length) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="simon-board">
        <div className="simon-grid">
          {colors.map((color) => (
            <button
              key={color}
              className={getButtonClass(color)}
              onClick={() => handleColorClick(color)}
              onTouchStart={() => gameStatus === 'input' && playColorSound(color, 100)}
              disabled={gameStatus !== 'input'}
            >
              <span className="button-inner">
                <span className="color-name">{color.toUpperCase()}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="simon-center">
          <div className="simon-logo">
            <span className="logo-text">SIMON</span>
            <div className="center-controls">
              {gameStatus === 'waiting' || gameStatus === 'gameover' ? (
                <button 
                  className="start-btn"
                  onClick={startGame}
                  onTouchStart={() => playSound('hover')}
                >
                  {gameStatus === 'waiting' ? 'START' : 'RESTART'}
                </button>
              ) : (
                <div className="level-display">
                  <span className="level-text">LEVEL</span>
                  <span className="level-number">{level + 1}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button 
          className="game-btn reset-btn"
          onClick={resetStats}
          onTouchStart={() => playSound('hover')}
        >
          <span className="btn-icon">📊</span>
          Reset Stats
        </button>
      </div>
    </div>
  )
}

export default SimonSays