import React, { useState, useCallback, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import './GuessTheNumber.css'

type GameStatus = 'playing' | 'won' | 'waiting'
type Hint = 'too-high' | 'too-low' | 'correct' | null

const GuessTheNumber: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  
  const [targetNumber, setTargetNumber] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [guesses, setGuesses] = useState<{ number: number; hint: Hint }[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [scores, setScores] = useState({
    gamesWon: parseInt(localStorage.getItem('guess-games-won') || '0'),
    totalGames: parseInt(localStorage.getItem('guess-total-games') || '0'),
    bestScore: parseInt(localStorage.getItem('guess-best-score') || '999'),
    averageGuesses: parseFloat(localStorage.getItem('guess-average') || '0')
  })
  const [range, setRange] = useState({ min: 1, max: 100 })

  const startNewGame = useCallback(() => {
    const newNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    setTargetNumber(newNumber)
    setGameStatus('playing')
    setGuesses([])
    setCurrentGuess('')
    
    const newTotalGames = scores.totalGames + 1
    setScores(prev => ({ ...prev, totalGames: newTotalGames }))
    localStorage.setItem('guess-total-games', newTotalGames.toString())
    
    playSound('success')
  }, [range, scores.totalGames, playSound])

  const makeGuess = useCallback(() => {
    const guess = parseInt(currentGuess)
    
    if (isNaN(guess) || guess < range.min || guess > range.max) {
      playSound('hover')
      return
    }

    let hint: Hint = null
    if (guess > targetNumber) {
      hint = 'too-high'
    } else if (guess < targetNumber) {
      hint = 'too-low'
    } else {
      hint = 'correct'
    }

    const newGuesses = [...guesses, { number: guess, hint }]
    setGuesses(newGuesses)
    setCurrentGuess('')
    
    if (hint === 'correct') {
      setGameStatus('won')
      const guessCount = newGuesses.length
      const newGamesWon = scores.gamesWon + 1
      
      // Update statistics
      const newBestScore = Math.min(scores.bestScore === 999 ? guessCount : scores.bestScore, guessCount)
      const totalGuessesEver = (scores.averageGuesses * scores.gamesWon) + guessCount
      const newAverage = totalGuessesEver / newGamesWon
      
      setScores(prev => ({
        ...prev,
        gamesWon: newGamesWon,
        bestScore: newBestScore,
        averageGuesses: newAverage
      }))
      
      localStorage.setItem('guess-games-won', newGamesWon.toString())
      localStorage.setItem('guess-best-score', newBestScore.toString())
      localStorage.setItem('guess-average', newAverage.toString())
      
      playSound('achievement')
      
      // Show achievement based on performance
      if (guessCount === 1) {
        showAchievement({
          id: 'guess-lucky',
          title: 'Lucky Shot!',
          description: 'Got it on the first try!',
          icon: '🎯'
        })
      } else if (guessCount <= 3) {
        showAchievement({
          id: 'guess-excellent',
          title: 'Excellent!',
          description: `Found it in ${guessCount} guesses!`,
          icon: '🎊'
        })
      } else if (guessCount <= 5) {
        showAchievement({
          id: 'guess-good',
          title: 'Well Done!',
          description: `Found it in ${guessCount} guesses!`,
          icon: '👏'
        })
      } else {
        showAchievement({
          id: 'guess-complete',
          title: 'Victory!',
          description: `Found it in ${guessCount} guesses!`,
          icon: '🏆'
        })
      }
      
      if (guessCount === newBestScore && newGamesWon > 1) {
        setTimeout(() => {
          showAchievement({
            id: 'guess-record',
            title: 'New Record!',
            description: `New best: ${guessCount} guesses!`,
            icon: '📈'
          })
        }, 1000)
      }
    } else {
      playSound('click')
    }
  }, [currentGuess, targetNumber, guesses, range, scores, playSound, showAchievement])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= range.max)) {
      setCurrentGuess(value)
    }
  }, [range.max])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameStatus === 'playing' && currentGuess.trim()) {
      makeGuess()
    }
  }, [gameStatus, currentGuess, makeGuess])

  const changeRange = useCallback((newMin: number, newMax: number) => {
    setRange({ min: newMin, max: newMax })
    if (gameStatus === 'playing') {
      startNewGame()
    }
    playSound('click')
  }, [gameStatus, startNewGame, playSound])

  const resetStats = useCallback(() => {
    setScores({ gamesWon: 0, totalGames: 0, bestScore: 999, averageGuesses: 0 })
    localStorage.setItem('guess-games-won', '0')
    localStorage.setItem('guess-total-games', '0')
    localStorage.setItem('guess-best-score', '999')
    localStorage.setItem('guess-average', '0')
    playSound('click')
  }, [playSound])

  const getHintText = (hint: Hint): string => {
    switch (hint) {
      case 'too-high': return 'Too High!'
      case 'too-low': return 'Too Low!'
      case 'correct': return 'Correct!'
      default: return ''
    }
  }

  const getHintClass = (hint: Hint): string => {
    switch (hint) {
      case 'too-high': return 'hint-high'
      case 'too-low': return 'hint-low'
      case 'correct': return 'hint-correct'
      default: return ''
    }
  }

  const getWinPercentage = (): number => {
    return scores.totalGames > 0 ? Math.round((scores.gamesWon / scores.totalGames) * 100) : 0
  }

  return (
    <div className="guess-number-game">
      <div className="game-header">
        <h2 className="game-title">
          <span className="title-icon">🔢</span>
          Guess the Number
        </h2>
        <p className="game-description">
          I'm thinking of a number between {range.min} and {range.max}. Can you guess it?
        </p>
      </div>

      <div className="range-selector">
        <button 
          className={`range-btn ${range.max === 50 ? 'active' : ''}`}
          onClick={() => changeRange(1, 50)}
          onTouchStart={() => playSound('hover')}
        >
          1-50 (Easy)
        </button>
        <button 
          className={`range-btn ${range.max === 100 ? 'active' : ''}`}
          onClick={() => changeRange(1, 100)}
          onTouchStart={() => playSound('hover')}
        >
          1-100 (Normal)
        </button>
        <button 
          className={`range-btn ${range.max === 200 ? 'active' : ''}`}
          onClick={() => changeRange(1, 200)}
          onTouchStart={() => playSound('hover')}
        >
          1-200 (Hard)
        </button>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Games Won</span>
          <span className="stat-value">{scores.gamesWon}/{scores.totalGames}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{getWinPercentage()}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best Score</span>
          <span className="stat-value">{scores.bestScore === 999 ? '-' : scores.bestScore}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average</span>
          <span className="stat-value">{scores.averageGuesses > 0 ? scores.averageGuesses.toFixed(1) : '-'}</span>
        </div>
      </div>

      <div className="game-area">
        {gameStatus === 'waiting' && (
          <div className="game-start">
            <p className="start-message">Ready to test your guessing skills?</p>
            <button 
              className="start-game-btn"
              onClick={startNewGame}
              onTouchStart={() => playSound('hover')}
            >
              <span className="btn-icon">🚀</span>
              Start New Game
            </button>
          </div>
        )}

        {gameStatus !== 'waiting' && (
          <div className="game-play">
            <div className="guess-info">
              <p className="range-display">Range: {range.min} - {range.max}</p>
              <p className="guess-count">Guesses: {guesses.length}</p>
            </div>

            {gameStatus === 'playing' && (
              <div className="guess-input-container">
                <div className="input-group">
                  <input
                    type="number"
                    className="guess-input"
                    value={currentGuess}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    min={range.min}
                    max={range.max}
                    placeholder={`Enter ${range.min}-${range.max}`}
                    autoFocus
                  />
                  <button 
                    className="guess-btn"
                    onClick={makeGuess}
                    onTouchStart={() => playSound('hover')}
                    disabled={!currentGuess.trim()}
                  >
                    Guess!
                  </button>
                </div>
              </div>
            )}

            {gameStatus === 'won' && (
              <div className="game-victory">
                <div className="victory-message">
                  <span className="victory-icon">🎉</span>
                  <h3 className="victory-text">Congratulations!</h3>
                  <p className="victory-details">
                    You found {targetNumber} in {guesses.length} guess{guesses.length !== 1 ? 'es' : ''}!
                  </p>
                </div>
                <button 
                  className="play-again-btn"
                  onClick={startNewGame}
                  onTouchStart={() => playSound('hover')}
                >
                  <span className="btn-icon">🎮</span>
                  Play Again
                </button>
              </div>
            )}

            <div className="guess-history">
              <h4 className="history-title">Guess History</h4>
              <div className="history-list">
                {guesses.map((guess, index) => (
                  <div key={index} className={`guess-item ${getHintClass(guess.hint)}`}>
                    <span className="guess-number">{guess.number}</span>
                    <span className="guess-hint">{getHintText(guess.hint)}</span>
                  </div>
                ))}
                {guesses.length === 0 && gameStatus === 'playing' && (
                  <p className="no-guesses">No guesses yet. Make your first guess above!</p>
                )}
              </div>
            </div>
          </div>
        )}
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
        {gameStatus !== 'waiting' && (
          <button 
            className="game-btn new-game-btn"
            onClick={startNewGame}
            onTouchStart={() => playSound('hover')}
          >
            <span className="btn-icon">🔄</span>
            New Game
          </button>
        )}
      </div>
    </div>
  )
}

export default GuessTheNumber