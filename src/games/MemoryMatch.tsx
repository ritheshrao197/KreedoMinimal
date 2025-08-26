import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import './MemoryMatch.css'

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

const GAME_SYMBOLS = ['🎮', '🕹️', '👾', '🎯', '⚡', '💎', '🔥', '⭐']

const MemoryMatch: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(
    localStorage.getItem('memoryMatchBestTime') ? 
    parseInt(localStorage.getItem('memoryMatchBestTime')!) : null
  )

  // Initialize the game
  const initializeGame = useCallback(() => {
    const gameCards: Card[] = []
    let cardId = 0

    // Create pairs of cards
    GAME_SYMBOLS.forEach(symbol => {
      gameCards.push({
        id: cardId++,
        symbol,
        isFlipped: false,
        isMatched: false
      })
      gameCards.push({
        id: cardId++,
        symbol,
        isFlipped: false,
        isMatched: false
      })
    })

    // Shuffle the cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }

    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(false)
    setGameComplete(false)
    setTimer(0)
  }, [])

  // Start the game
  const startGame = () => {
    setGameStarted(true)
    playSound('success')
    showAchievement({
      id: 'memory-start',
      title: 'Memory Master',
      description: 'Started a memory challenge',
      icon: '🧠'
    })
  }

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameComplete) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    playSound('click')
    
    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    // If this is the second card flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstCardId)
      const secondCard = cards.find(c => c.id === secondCardId)
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found!
        playSound('success')
        setMatches(prev => prev + 1)
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isMatched: true } 
              : c
          ))
          setFlippedCards([])
          
          // Check if game is complete
          if (matches + 1 === GAME_SYMBOLS.length) {
            setGameComplete(true)
            handleGameComplete()
          }
        }, 600)
      } else {
        // No match
        playSound('error')
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isFlipped: false } 
              : c
          ))
          setFlippedCards([])
        }, 1200)
      }
    }
  }

  // Handle game completion
  const handleGameComplete = () => {
    const timeAchievements = [
      { time: 30, id: 'speed-demon', title: 'Speed Demon', description: 'Completed memory game in under 30 seconds', icon: '⚡' },
      { time: 60, id: 'quick-thinker', title: 'Quick Thinker', description: 'Completed memory game in under 1 minute', icon: '🧠' },
      { time: 120, id: 'memory-champion', title: 'Memory Champion', description: 'Completed the memory challenge', icon: '🏆' }
    ]

    const moveAchievements = [
      { moves: 16, id: 'perfect-memory', title: 'Perfect Memory', description: 'Completed with minimum moves', icon: '💎' },
      { moves: 20, id: 'sharp-mind', title: 'Sharp Mind', description: 'Completed with excellent moves', icon: '⭐' },
      { moves: 30, id: 'good-memory', title: 'Good Memory', description: 'Completed with good performance', icon: '👍' }
    ]

    // Award time-based achievement
    const timeAchievement = timeAchievements.find(ach => timer <= ach.time)
    if (timeAchievement) {
      showAchievement(timeAchievement)
    }

    // Award move-based achievement
    const moveAchievement = moveAchievements.find(ach => moves <= ach.moves)
    if (moveAchievement) {
      showAchievement(moveAchievement)
    }

    // Update best time
    if (!bestTime || timer < bestTime) {
      setBestTime(timer)
      localStorage.setItem('memoryMatchBestTime', timer.toString())
      showAchievement({
        id: 'new-record',
        title: 'New Record!',
        description: `Beat your best time: ${timer}s`,
        icon: '📈'
      })
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: number
    
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameComplete])

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="memory-match">
      <div className="game-header">
        <h3 className="game-title">
          <span className="game-icon">🧠</span>
          Memory Match
        </h3>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matches:</span>
            <span className="stat-value">{matches}/{GAME_SYMBOLS.length}</span>
          </div>
        </div>
      </div>

      {bestTime && (
        <div className="best-time">
          <span className="best-time-icon">🏆</span>
          Best Time: {formatTime(bestTime)}
        </div>
      )}

      <div className="game-status">
        {!gameStarted && !gameComplete && (
          <div className="status-message ready">
            <p>Ready to test your memory?</p>
            <button className="start-btn" onClick={startGame}>
              <span className="btn-icon">🚀</span>
              Start Game
            </button>
          </div>
        )}
        
        {gameStarted && !gameComplete && (
          <div className="status-message playing">
            Find all matching pairs!
          </div>
        )}
        
        {gameComplete && (
          <div className="status-message victory">
            <p>🎉 Congratulations! 🎉</p>
            <p>Completed in {moves} moves and {formatTime(timer)}</p>
          </div>
        )}
      </div>

      <div className="memory-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <span className="card-back-symbol">?</span>
              </div>
              <div className="card-back">
                <span className="card-symbol">{card.symbol}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="reset-btn"
        onClick={initializeGame}
        disabled={!gameStarted && !gameComplete}
      >
        <span className="btn-icon">🔄</span>
        New Game
      </button>
    </div>
  )
}

export default MemoryMatch